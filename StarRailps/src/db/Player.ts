import Session from "../server/kcp/Session";
import { AvatarType, ExtraLineupType, HeroBasicType, LineupInfo, Vector } from "../data/proto/StarRail";
import Logger from "../util/Logger";
import Account from "./Account";
import Avatar from "./Avatar";
import Database from "./Database";
import { Scene } from "../game/Scene";
const c = new Logger("Player");

export interface LineupI {
    avatarList: number[];
    isVirtual: boolean;
    planeId: number;
    mp: number;
    leaderSlot: number;
    index: number;
    extraLineupType: ExtraLineupType;
    name: string;
}
interface PlayerI {
    _id: number;
    name: string;
    token: string;
    banned: boolean;
    heroBasicType: HeroBasicType;
    basicInfo: {
        nickname: string;
        level: number;
        exp: number;
        stamina: number;
        mcoin: number;
        hcoin: number;
        scoin: number;
        worldLevel: number;
    }
    lineup: {
        curIndex: number;
        lineups: {
            [key: number]: LineupI;
        };
    }
    posData: {
        floorID: number;
        planeID: number;
        pos: Vector;
    }
}

export default class Player {
    public readonly uid: number
    public readonly scene: Scene;

    private constructor(readonly session: Session, public db: PlayerI) {
        this.uid = db._id;
        this.scene = new Scene(this);
    }

    public static async fromUID(session: Session, uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const db = Database.getInstance();
        const player = await db.get("players", { _id: uid }) as unknown as PlayerI;
        if (!player) return Player.create(session, uid);
        return new Player(session, player);
    }

    public static async fromToken(session: Session, token: string): Promise<Player | undefined> {
        const db = Database.getInstance();
        const plr = await db.get("players", { token }) as unknown as PlayerI;
        if (!plr) return Player.fromUID(session, (await Account.fromToken(token))?.uid || Math.round(Math.random() * 50000));

        return new Player(session, plr);
    }

    public async getLineup(lineupIndex?: number): Promise<LineupInfo> {
        const curIndex = this.db.lineup.curIndex;
        const lineup = this.db.lineup.lineups[lineupIndex || curIndex];
        const avatars = await Avatar.fromLineup(this.uid, lineup);
        let slot = 0;
        avatars.forEach(avatar => {
            // Fallback lineup
            if (!avatar) return; // Matsuko.
            if (!avatar.lineup) avatar.lineup = {
                avatarType: AvatarType.AVATAR_FORMAL_TYPE,
                hp: 10000,
                id: 1001,
                satiety: 100,
                slot: slot,
                sp: 10000
            }
            avatar.lineup.slot = slot++;
        });
        return {
            ...lineup,
            index: 0,
            avatarList: avatars.map(x => x.lineup)
        }
    }

    public setLineup(lineup: LineupInfo, index?: number, curIndex: number = this.db.lineup.curIndex) {
        this.db.lineup.lineups[index || curIndex] = {
            ...lineup,
            avatarList: lineup.avatarList.map(x => x.id)
        };

        this.db.lineup.curIndex = curIndex;
    }

    public static async create(session: Session, uid: number | string): Promise<Player | undefined> {
        if (typeof uid == "string") uid = Number(uid);
        const acc = await Account.fromUID(uid);
        if (!acc) {
            c.warn(`Account ${uid} not found`);
            return;
        }
        const db = Database.getInstance();

        const dataObj = {
            _id: acc.uid,
            name: acc.name,
            token: acc.token,
            heroBasicType: HeroBasicType.BoyWarrior,
            basicInfo: {
                exp: 0,
                level: 1,
                hcoin: 0,
                mcoin: 0,
                nickname: acc.name,
                scoin: 0,
                stamina: 100,
                worldLevel: 1,
            },
            lineup: {
                curIndex: 0,
                lineups: {}
            },
            posData: {
                floorID: 10001001,
                planeID: 10001,
                pos: {
                    x: 0,
                    y: 439,
                    z: -45507
                }
            },
            banned: false
        } as PlayerI

        const baseLineup = {
            avatarList: [1001],
            extraLineupType: ExtraLineupType.LINEUP_NONE,
            index: 0,
            isVirtual: false,
            leaderSlot: 0,
            mp: 100, // ?? Not sure what this is
            name: "",
            planeId: 10001
        }
        const LINEUPS = 6;
        dataObj.lineup = {
            curIndex: 0,
            lineups: {}
        }
        for (let i = 0; i <= LINEUPS; i++) {
            const copy = baseLineup;
            copy.index = 0;
            copy.name = `Team ${i}`;
            dataObj.lineup.lineups[i] = copy;
        }

        await Avatar.create(uid, 1001, 0);
        

        await db.set("players", dataObj);
        return new Player(session, dataObj);
    }

    public async save() {
        const db = Database.getInstance();
        c.debug(JSON.stringify(this.db, null, 2));
        await db.update("players", { _id: this.db._id }, this.db);
    }
}
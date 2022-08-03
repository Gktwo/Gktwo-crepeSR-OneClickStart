import { Avatar as AvatarI, AvatarType, LineupAvatar } from '../data/proto/StarRail';
import Logger from '../util/Logger';
import Database from './Database';
import Player, { LineupI } from './Player';
const c = new Logger("Avatar");
type UID = number | string;

export default class Avatar {
    private constructor(public ownerUid: UID, public data: AvatarI, public lineup: LineupAvatar) {

    }

    public static async create(uid: UID, baseAvatarId: number = 1001, slot: number = -1): Promise<Avatar> {
        const db = Database.getInstance();
        // Check if already exists
        const existing = await Avatar.fromUID(uid, baseAvatarId);
        if (existing.length > 0) return existing[0];
        const avatar = new Avatar(uid, {
            baseAvatarId,
            equipmentUniqueId: 20003, // TODO: Placeholder while we work on inventory system
            equipRelicList: [],
            exp: 0,
            level: 1,
            promotion: 1,
            rank: 1,
            skilltreeList: [],
        }, {
            avatarType: AvatarType.AVATAR_FORMAL_TYPE,
            hp: 10000,
            id: baseAvatarId,
            satiety: 100,
            slot: slot,
            sp: 10000
        });
        db.set("avatars", avatar);
        return avatar;
    }

    public static async fromUID(ownerUid: UID, baseAvatarId?: number): Promise<Avatar[]> {
        const query = { ownerUid } as { ownerUid: UID, "data.baseAvatarId"?: number };
        if (baseAvatarId) query['data.baseAvatarId'] = baseAvatarId;
        const db = Database.getInstance();
        return await db.getAll("avatars", query) as unknown as Avatar[];
    }

    public static async fromLineup(uid: UID, lineup: LineupI): Promise<Avatar[]> {
        try {
            const avatarList: Array<Avatar> = [];

            for (let i = 0; i < lineup.avatarList.length; i++) {
                const avatarId = lineup.avatarList[i];
                const avatar = await Avatar.fromUID(uid, avatarId);
                avatarList.push(avatar[0]);
            }

            return await Promise.all(avatarList);
        } catch (e) {
            c.error(e as Error);
            return [];
        }
    }

    public static async remove(ownerUid: UID, baseAvatarId: number): Promise<void> {
        const db = Database.getInstance();
        await db.delete("avatars", { ownerUid, "data.baseAvatarId": baseAvatarId });
    }

}
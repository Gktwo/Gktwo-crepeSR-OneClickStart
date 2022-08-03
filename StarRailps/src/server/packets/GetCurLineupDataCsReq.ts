import { AvatarType, ExtraLineupType, GetCurLineupDataScRsp } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    let lineup = await session.player.getLineup();

    // This is a HORRIBLE solution, but tbh I just can't reproduce the bug so:
    if (!lineup) {
        session.c.error("Error! lineup is undefined. Falling back to default lineup.", false);
        lineup = {
            avatarList: [{
                avatarType: AvatarType.AVATAR_FORMAL_TYPE,
                hp: 10000,
                id: 1001,
                sp: 10000,
                satiety: 100,
                slot: 0,
            }],
            extraLineupType: ExtraLineupType.LINEUP_NONE,
            index: 0,
            isVirtual: false,
            leaderSlot: 0,
            mp: 100,
            planeId: 10001,
            name: "Fallback"
        }
        session.player.setLineup(lineup, 0, 0);
        session.player.save();
    }

    session.send(GetCurLineupDataScRsp, {
        retcode: 0,
        lineup: {
            ...lineup,
        }
    } as GetCurLineupDataScRsp);
}
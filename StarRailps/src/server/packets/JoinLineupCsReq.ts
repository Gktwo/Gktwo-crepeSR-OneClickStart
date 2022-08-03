import { AvatarType, JoinLineupCsReq, JoinLineupScRsp, SyncLineupNotify, SyncLineupReason } from "../../data/proto/StarRail";
import Avatar from "../../db/Avatar";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// JoinLineupCsReq { baseAvatarId: 1002, slot: 1 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as JoinLineupCsReq;
    session.send(JoinLineupScRsp, { retcode: 0 });

    let lineup = await session.player.getLineup();
    const slot = body.slot || 0;
    const avatarList = [];
    for (const avatarId in lineup) {
        const avatar = await Avatar.fromUID(session.player.db._id, Number(avatarId));
        if (avatar.length === 0) return session.c.warn(`Avatar ${body.baseAvatarId} not found`);
        if (avatar) avatarList.push(avatar[0]);
    }

    lineup.avatarList[slot] = {
        avatarType: AvatarType.AVATAR_FORMAL_TYPE,
        hp: 10000,
        id: body.baseAvatarId,
        satiety: 100,
        slot,
        sp: 10000
    };
    if (body.extraLineupType) lineup.extraLineupType = body.extraLineupType;
    session.player.setLineup(lineup);
    session.player.save();

    session.send(SyncLineupNotify, {
        lineup: lineup,
        reasonList: [SyncLineupReason.SYNC_REASON_NONE]
    } as SyncLineupNotify);
}
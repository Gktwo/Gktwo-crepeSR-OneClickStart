import { GetAvatarDataCsReq, GetAvatarDataScRsp } from "../../data/proto/StarRail";
import AvatarExcelTable from "../../data/excel/AvatarExcelTable.json";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";
import AvatarDb from "../../db/Avatar";

import { Avatar } from "../../data/proto/StarRail";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as GetAvatarDataCsReq;

    const avatar = await AvatarDb.fromUID(session.player.db._id);

    console.log(avatar.length)
    const dataObj = {
        retcode: 0,
        avatarList: avatar.map(av => Avatar.fromPartial(av.data)),
        isAll: body.isGetAll
    };

    Object.values(AvatarExcelTable).forEach(avatar => {
        // dataObj.avatarList.push()
    });

    session.send(GetAvatarDataScRsp, dataObj);
}
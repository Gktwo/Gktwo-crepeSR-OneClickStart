import { GetCurSceneInfoScRsp, Vector } from "../../data/proto/StarRail";
import { ActorEntity } from "../../game/entities/Actor";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const posData = session.player.db.posData;
    const _lineup = session.player.db.lineup;
    const lineup = _lineup.lineups[_lineup.curIndex];
    const curAvatarEntity = new ActorEntity(session.player.scene, lineup.avatarList[0], posData.pos);
    session.send(GetCurSceneInfoScRsp, {
        retcode: 0,
        scene: {
            planeId: posData.planeID,
            floorId: posData.floorID,
            entityList: [
                curAvatarEntity
            ],
            entityBuffList: [],
            entryId: 10001,
            envBuffList: [],
            gameModeType: 1,
            lightenSectionList: []
        },
    } as unknown as GetCurSceneInfoScRsp);
    session.player.scene.spawnEntity(curAvatarEntity, true);
    session.player.scene.entryId = 10001;
}
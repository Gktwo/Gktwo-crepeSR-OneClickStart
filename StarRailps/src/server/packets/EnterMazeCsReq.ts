import { EnterMazeCsReq, EnterMazeScRsp } from "../../data/proto/StarRail";
import MazePlaneExcel from "../../util/excel/MazePlaneExcel";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as EnterMazeCsReq;

    const mazeEntry = MazePlaneExcel.getEntry(body.entryId);

    let curLineup = await session.player.getLineup();
    curLineup.planeId = mazeEntry.PlaneID;
    session.player.setLineup(curLineup);
    session.player.db.posData.floorID = mazeEntry.FloorID;
    session.player.db.posData.planeID = mazeEntry.PlaneID;
    session.player.save();

    session.send(EnterMazeScRsp, {
        retcode: 0,
        maze: {
            floor: {
                floorId: mazeEntry.FloorID,
                scene: {
                    planeId: mazeEntry.PlaneID,
                    floorId: mazeEntry.FloorID,
                    gameModeType: 1,
                }
            },
            id: mazeEntry.PlaneID,
            mapEntryId: body.entryId,
        }
    } as EnterMazeScRsp);
}
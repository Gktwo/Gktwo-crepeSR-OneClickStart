import { ChallengeStatus, ExtraLineupType, StartChallengeCsReq, StartChallengeScRsp } from "../../data/proto/StarRail";
import Packet from "../kcp/Packet";
import Session from "../kcp/Session";

// StartChallengeCsReq { challengeId: 101 }
export default async function handle(session: Session, packet: Packet) {
    const body = packet.body as StartChallengeCsReq;

    // TODO: This packet is just a base

    session.send(StartChallengeScRsp, {
        retcode: 0,
        curChallenge: {
            challengeId: body.challengeId,
            deadAvatarNum: 0,
            extraLineupType: ExtraLineupType.LINEUP_CHALLENGE,
            rounds: 1,
            status: ChallengeStatus.CHALLENGE_DOING,
            killMonsterList: [{
                monsterId: 8013010,
                killNum: 1,
            }]
        },
        maze: {
            // ? Data from MappingInfoExcelTable
            id: 30101,
            mapEntryId: 10001,
            floor: {
                floorId: 20121001,
                scene: {
                    planeId: 20121,
                    entryId: 1000,
                    floorId: 20121001,
                    gameModeType: 1,
                    entityList: [{
                        entityId: 10010101,
                        npcMonster: {
                            monsterId: 8013010,
                            worldLevel: 1,
                        },
                        groupId: 11,
                        motion: {
                            pos: {
                                x: 0,
                                y: 100,
                                z: 0,
                            },
                            rot: {
                                x: 0,
                                y: 0,
                                z: 0
                            }
                        },
                    }]
                }
            }
        }
    } as StartChallengeScRsp);
}
import _MapEntryExcelTable from "../../data/excel/MapEntryExcelTable.json";
import _MazePlaneExcelTable from "../../data/excel/MazePlaneExcelTable.json";

interface MazePlaneExcelTableEntry {
    PlaneID: number;
    PlaneType: string;
    SubType: number;
    WorldID: number;
    PlaneName: string;
    StartFloorID: number;
    FloorIDList: number[];
}

interface TextMap {
    hash: number;
}

type EntranceType = "Town" | "Mission" | "Explore";

interface MapEntryExcelTableEntry {
    ID: number;
    IsShowInMapMenu: boolean;
    MapMenuSortID: number;
    EntranceType: EntranceType | number; // Actually an enum. Town | Mission | Explore
    EntranceGroupID: number;
    Name: TextMap;
    Desc: TextMap;
    EntranceListIcon: string;
    ImagePath: string;
    MiniMapIconHintList: any[];
    ShowReward: number;
    PlaneID: number;
    FloorID: number;
    StartGroupID: number;
    StartAnchorID: number;
    TargetMission: number;
    TargetMainMissionList: number[];
    BeginMainMissionList: number[];
    FinishMainMissionList: number[];
    FinishQuestList: number[];
    UnlockQuest: number;
}

const MazePlaneExcelTable = _MazePlaneExcelTable as { [key: string]: MazePlaneExcelTableEntry };
const MapEntryExcelTable = _MapEntryExcelTable as { [key: string]: MapEntryExcelTableEntry };

export default class MazePlaneExcel {
    private constructor() { }

    public static fromEntryId(entryId: number): MazePlaneExcelTableEntry {
        const mapEntry = MapEntryExcelTable[entryId.toString()];
        return MazePlaneExcelTable[mapEntry.PlaneID.toString()];
    }

    public static fromPlaneId(planeId: number): MazePlaneExcelTableEntry {
        return MazePlaneExcelTable[planeId.toString()];
    }

    public static getEntry(entryId: number): MapEntryExcelTableEntry {
        return MapEntryExcelTable[entryId.toString()];
    }

    public static getAllEntries(): MapEntryExcelTableEntry[] {
        return Object.values(MapEntryExcelTable);
    }
}
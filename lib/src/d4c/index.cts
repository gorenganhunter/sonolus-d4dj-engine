export enum D4CNoteType {
    Tap1 = "Tap1",
    Tap2 = "Tap2",
    Scratch = "Scratch",
    StopStart = "StopStart",
    StopEnd = "StopEnd",
    LongStart = "LongStart",
    LongMiddle = "LongMiddle",
    LongEnd = "LongEnd",
    Slide = "Slide",
}

export type D4CNoteData = {
    // 0 - 6, note 0 and 6 is not for regular notes
    LaneId: number;
    Type: D4CNoteType;
    Beat: number;
    NextId?: number;
    TimeScaleGroupId: number;
    // for slide, it's auto generated for now
    Direction?: number;
    // for slide, sound fx type
    EffectType?: number;
    // sound fx parameter
    EffectParameter?: number;
};

// Guessed type, seems like timing stuff, only effects lane 1-5
export type D4CSoflanData = {
    Beat: number;
    TimeScale: number;
    // Assume 1 is left and 2 is right
    LeftRight: number;
};

export type D4CSoflanGroup = {
    id: number;
    SoflanDataList: D4CSoflanData[];
}

export type D4CBarLineData = number | {
    Beat: number;
    TimeScaleGroupId?: string;
}

export type D4CChartData = {
    Offset: number;
    BpmDataList: D4CBpmData[];
    TimeScaleGroupList: D4CSoflanGroup[];
    BarLine: {
        DefaultTimeScaleGroupId: number;
        List: D4CBarLineData[];
    }
    NoteDataList: D4CNoteData[];
};

export type D4CBpmData = {
    Beat: number;
    Bpm: number;
}

export type B34DJChart = {
    MusicName: string;
    SoflanDataList: B34DJSoflanData[];
    BarLineList: number[];
    NoteDataList: B34DJNoteData[];
}

// Guessed type, seems like timing stuff, only effects lane 1-5
export type B34DJSoflanData = {
    Time: number;
    TimeScale: number;
    // Assume 1 is left and 2 is right
    LeftRight: number;
}

export type B34DJNoteData = {
    // 0 - 6, note 0 and 6 is not for regular notes
    LaneId: number;
    Type: B34DJNoteType;
    Time: number;
    NextId?: number;
    // for slide, it's auto generated for now
    Direction?: number;
    // for slide, sound fx type
    EffectType?: number;
    // sound fx parameter
    EffectParameter?: number;
}

export enum B34DJNoteType {
    Tap1 = "Tap1",
    Tap2 = "Tap2",
    ScratchLeft = "ScratchLeft",
    ScratchRight = "ScratchRight",
    StopStart = "StopStart",
    StopEnd = "StopEnd",
    LongStart = "LongStart",
    LongMiddle = "LongMiddle",
    LongEnd = "LongEnd",
    Slide = "Slide",
}

export enum D4DJNoteType {
    Tap1,
    Tap2,
    ScratchLeft,
    ScratchRight,
    StopStart,
    StopEnd,
    LongStart,
    LongMiddle,
    LongEnd,
    Slide
}

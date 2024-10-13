export type B34DJChart = {
    MusicName: "music_0000001",
    BarLineList: number[],
    SoflanDataList: B34DJSoflanData[]
}

export type B34DJSoflanData = {
    Time: number,
    TimeScale: number,
    LeftRight: number
}

export type B34DJNoteData = {
    LaneId: number,
    Time: number,
    Type: "Tap1"
        | "Tap2"
        | "ScratchLeft"
        | "ScratchRight"
        | "StopStart"
        | "StopEnd"
        | "LongStart"
        | "LongMiddle"
        | "LongEnd"
        | "Slide",
    NextId: number,
    Direction: number,
    EffectType: number,
    EffectParameter: number
}

import { LevelData, LevelDataEntity } from '@sonolus/core'
import { D4CChartData, D4CNoteType, D4CSoflanData } from './index.cjs'

export function d4cToLevelData(chart: D4CChartData, offset = 0): LevelData {
    // let d4chart: any = []

    // d4chart[0] = chart.MusicName
    // d4chart[1] = []
    // d4chart[2] = chart.BarLineList
    // d4chart[3] = chart.NoteDataList.map((note: B34DJNoteData) => [note.LaneId, D4DJNoteType[note.Type], note.Time, note.NextId, note.Direction, note.EffectType, note.EffectParameter])

    // const timescale = chart.SoflanDataList.map((soflan: B34DJSoflanData) => [soflan.Time, soflan.TimeScale, soflan.LeftRight])
    // timescale.forEach((ts: any) => {
    //     const i = d4chart[1].findIndex((tsc: number[]) => (tsc[0] === ts[0]) && (tsc[1] === ts[1]))
    //     if (i === -1) d4chart[1].push(ts)
    //     else d4chart[1][i][2] = 3
    // })
    
    let disc = {
        left: chart.TimeScaleGroupList.flatMap(tsg => tsg.SoflanDataList).filter((soflan: D4CSoflanData) => [1,3].includes(soflan.LeftRight)).sort((a, b) => a.Beat - b.Beat),
        right: chart.TimeScaleGroupList.flatMap(tsg => tsg.SoflanDataList).filter((soflan: D4CSoflanData) => [2,3].includes(soflan.LeftRight)).sort((a, b) => a.Beat - b.Beat)
    }

    chart.TimeScaleGroupList.push({ id: -4, SoflanDataList: disc.left }, { id: -3, SoflanDataList: disc.right })

    let data: LevelData = {
        bgmOffset: chart.Offset + offset,
        entities: [
            {
                archetype: "Initialization",
                data: [],
            },
            {
                archetype: "Stage",
                data: [
                    {
                        name: "discTsgL",
                        ref: "tsg:-4"
                    },
                    {
                        name: "discTsgR",
                        ref: "tsg:-3"
                    }
                ],
            },
        ],
    };

    let bpm = chart.BpmDataList.map(({ Bpm, Beat }) => ({
        archetype: "#BPM_CHANGE",
        data: [
            {
                name: "#BEAT",
                value: Beat,
            },
            {
                name: "#BPM",
                value: Bpm,
            },
        ],
    }))

    let ts = chart.TimeScaleGroupList.map(({ id, SoflanDataList }) => ([
        {
            archetype: "TimeScaleGroup",
            data: [
                {
                    name: "first",
                    ref: `tsc:${id}:-1`,
                },
                {
                    name: "length",
                    value: SoflanDataList.length + 1,
                }
            ],
            name: `tsg:${id}`,
        },
        {
            archetype: "TimeScaleChange",
            data: [
                {
                    name: "#BEAT",
                    value: 0,
                },
                {
                    name: "timeScale",
                    value: 1,
                },
                {
                    name: "next",
                    ref: `tsc:${id}:0`,
                },
            ],
            name: `tsc:${id}:-1`,
        }, ...SoflanDataList.map(({ Beat, TimeScale }, i) => ({
            archetype: "TimeScaleChange",
            data: [
                {
                    name: "#BEAT",
                    value: Beat,
                },
                {
                    name: "timeScale",
                    value: TimeScale,
                },
                {
                    name: "next",
                    ref: `tsc:${id}:${i + 1}`,
                },
            ],
            name: `tsc:${id}:${i}`,
        }))]));
    let bl = chart.BarLine.List.map((br) => ({
        archetype: "BarLine",
        data: [
            {
                name: "#BEAT",
                value: typeof br == "number" ? br : br.Time,
            },
            {
                name: "timeScaleGroup",
                ref: typeof br == "number" ? `tsg:${chart.BarLine.DefaultTimeScaleGroupId}` : `tsg:${br.TimeScaleGroupId || chart.BarLine.DefaultTimeScaleGroupId}`,
            },
        ],
    }));
    let notes = note(chart);

    data.entities.push(...bpm, ...ts.flat(), ...notes, ...bl);
    return data;
}

function note(chart: D4CChartData): LevelDataEntity[] {
    let hold: any[] = [];
    let slider: any[] = [];
    let notes: any = {};
    let nots = chart.NoteDataList.map(({ Beat, Type, LaneId, NextId, Direction, EffectType, EffectParameter, TimeScaleGroupId }, i: number) => {
        const not: LevelDataEntity = {
            archetype:
                Type === D4CNoteType.Tap1
                    ? "DarkTapNote"
                    : Type === D4CNoteType.Tap2
                      ? "LightTapNote"
                      : Type === D4CNoteType.Scratch
                        ? "ScratchNote"
                        : Type === D4CNoteType.StopStart
                          ? "StopStartNote"
                          : Type === D4CNoteType.StopEnd
                            ? "StopEndNote"
                            : Type === D4CNoteType.LongStart
                              ? "HoldStartNote"
                              : Type === D4CNoteType.LongEnd
                                ? "HoldEndNote"
                                : Type === D4CNoteType.LongMiddle
                                  ? "HoldMiddleNote"
                                  : Direction !== 0
                                    ? "SliderFlickNote"
                                    : "SliderTickNote",

            data: [
                {
                    name: "#BEAT",
                    value: Beat,
                },
                {
                    name: "lane",
                    value: LaneId - 3,
                },
                {
                    name: "timeScaleGroup",
                    ref: `tsg:${TimeScaleGroupId}`,
                },
            ],

            name: `note${i}`,
        };

        notes[Beat]
            ? notes[Beat].push({ name: `note${i}`, lane: LaneId })
            : (notes[Beat] = [{ name: `note${i}`, lane: LaneId }]);

        if (NextId && (Type === D4CNoteType.LongStart || Type === D4CNoteType.StopStart)) {
            let note: any = {};
            note.head = not.name;
            note.tail = `note${NextId}`;
            hold.push(note);
            not.data.push({
                name: "tail",
                ref: `note${NextId}`,
            });
        }

        if (Type === D4CNoteType.Slide) {
            if (NextId && NextId > 0) {
                slider.push({ prev: not.name, next: `note${NextId}` });
                not.data.push({
                    name: "next",
                    ref: `note${NextId}`,
                });
            }

            const sld = slider.find((note) => note.next === not.name);
            if (sld)
                not.data.push({
                    name: "prev",
                    ref: sld.prev,
                });
        }

        if (Type === D4CNoteType.LongEnd || Type === D4CNoteType.StopEnd) {
            not.data.push({
                name: "head",
                ref: hold.find((note) => note.tail === not.name).head,
            });
        }

        if (Direction)
            not.data.push({
                name: "direction",
                value: Direction,
            });

        return not;
    });

    hold.forEach(({ head, tail }, i) =>
        nots.splice(parseInt(head.replace("note", "")) + 1 + i, 0, {
            archetype: "HoldConnector",
            data: [
                {
                    name: "head",
                    ref: head,
                },
                {
                    name: "tail",
                    ref: tail,
                },
            ],
        }),
    );

    for (const beat in notes) {
        const sim = notes[beat].sort((a: any, b: any) => a.lane - b.lane);
        if (sim.length === 2) {
            nots.push({
                archetype: "SimLine",
                data: [
                    {
                        name: "a",
                        ref: sim[0].name,
                    },
                    {
                        name: "b",
                        ref: sim[1].name,
                    },
                ],
            });
        } else if (sim.length === 3) {
            nots.push({
                archetype: "SimLine",
                data: [
                    {
                        name: "a",
                        ref: sim[0].name,
                    },
                    {
                        name: "b",
                        ref: sim[1].name,
                    },
                ],
            });
            nots.push({
                archetype: "SimLine",
                data: [
                    {
                        name: "a",
                        ref: sim[1].name,
                    },
                    {
                        name: "b",
                        ref: sim[2].name,
                    },
                ],
            });
        }
    }

    return nots;
}

import { LevelData } from '@sonolus/core'
import { B34DJChart, B34DJNoteData, B34DJSoflanData, D4DJNoteType } from './index.cjs'

export function b34djToLevelData(chart: B34DJChart, offset = 0): LevelData {
    let d4chart: any = []

    d4chart[0] = chart.MusicName
    d4chart[1] = []
    d4chart[2] = chart.BarLineList
    d4chart[3] = chart.NoteDataList.map((note: B34DJNoteData) => [note.LaneId, D4DJNoteType[note.Type], note.Time, note.NextId, note.Direction, note.EffectType, note.EffectParameter])

    const timescale = chart.SoflanDataList.map((soflan: B34DJSoflanData) => [soflan.Time, soflan.TimeScale, soflan.LeftRight])
    timescale.forEach((ts: any) => {
        const i = d4chart[1].findIndex((tsc: number[]) => (tsc[0] === ts[0]) && (tsc[1] === ts[1]))
        if (i === -1) d4chart[1].push(ts)
        else d4chart[1][i][2] = 3
    })
    
    return d4djToLevelData(d4chart, offset);
};

export function d4djToLevelData(chart: any, offset = 0): LevelData {
    let disc = {
        left: chart[1].filter((soflan: any) => [1,3].includes(soflan[2])),
        right: chart[1].filter((soflan: any) => [2,3].includes(soflan[2]))
    }
    let data = {
        bgmOffset: offset,
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
                        ref: "tsg:3"
                    },
                    {
                        name: "discTsgR",
                        ref: "tsg:4"
                    }
                ],
            },
            {
                archetype: "#BPM_CHANGE",
                data: [
                    {
                        name: "#TIME",
                        value: 0,
                    },
                    {
                        name: "#BPM",
                        value: 60,
                    },
                ],
            },
            {
                archetype: "TimeScaleGroup",
                data: [
                    {
                        name: "first",
                        ref: "tsc:0:0",
                    },
                    {
                        name: "length",
                        value: chart[1].length + 1,
                    },
                    {
                        name: "next",
                        ref: "tsg:1",
                    },
                ],
                name: "tsg:0",
            },
            {
                archetype: "TimeScaleGroup",
                data: [
                    {
                        name: "first",
                        ref: "tsc:1:0",
                    },
                    {
                        name: "length",
                        value: 1,
                    },
                    {
                        name: "next",
                        ref: "tsg:2",
                    },
                ],
                name: "tsg:1",
            },
            {
                archetype: "TimeScaleGroup",
                data: [
                    {
                        name: "first",
                        ref: "tsc:2:0",
                    },
                    {
                        name: "length",
                        value: 1,
                    },
                    {
                        name: "next",
                        ref: "tsg:3",
                    },
                ],
                name: "tsg:2",
            },
            {
                archetype: "TimeScaleGroup",
                data: [
                    {
                        name: "first",
                        ref: "tsc:3:0",
                    },
                    {
                        name: "length",
                        value: disc.left.length + 1,
                    },
                    {
                        name: "next",
                        ref: "tsg:4",
                    },
                ],
                name: "tsg:3",
            },
            {
                archetype: "TimeScaleGroup",
                data: [
                    {
                        name: "first",
                        ref: "tsc:4:0",
                    },
                    {
                        name: "length",
                        value: disc.right.length + 1,
                    },
                    {
                        name: "next",
                        value: -1,
                    },
                ],
                name: "tsg:4",
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
                        ref: `tsc:0:1`,
                    },
                ],
                name: `tsc:0:0`,
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
                        value: -1,
                    },
                ],
                name: `tsc:1:0`,
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
                        value: -1,
                    },
                ],
                name: `tsc:2:0`,
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
                        ref: "tsc:3:1",
                    },
                ],
                name: `tsc:3:0`,
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
                        ref: "tsc:4:1",
                    },
                ],
                name: `tsc:4:0`,
            },
        ],
    };

    let ts = chart[1].map((arr: any[], i: number) => ({
        archetype: "TimeScaleChange",
        data: [
            {
                name: "#BEAT",
                value: arr[0],
            },
            {
                name: "timeScale",
                value: arr[1],
            },
            {
                name: "next",
                ref: `tsc:0:${i + 2}`,
            },
        ],
        name: `tsc:0:${i + 1}`,
    }));
    let discL = disc.left.map((arr: any[], i: number) => ({
        archetype: "TimeScaleChange",
        data: [
            {
                name: "#BEAT",
                value: arr[0],
            },
            {
                name: "timeScale",
                value: arr[1],
            },
            {
                name: "next",
                ref: `tsc:3:${i + 2}`,
            },
        ],
        name: `tsc:3:${i + 1}`,
    }));
    let discR = disc.right.map((arr: any[], i: number) => ({
        archetype: "TimeScaleChange",
        data: [
            {
                name: "#BEAT",
                value: arr[0],
            },
            {
                name: "timeScale",
                value: arr[1],
            },
            {
                name: "next",
                ref: `tsc:4:${i + 2}`,
            },
        ],
        name: `tsc:4:${i + 1}`,
    }));
    let bl = chart[2].map((time: number) => ({
        archetype: "BarLine",
        data: [
            {
                name: "#BEAT",
                value: time,
            },
            {
                name: "timeScaleGroup",
                ref: "tsg:0",
            },
        ],
    }));
    let notes = note(chart);

    const sd = Array.from({ length: Math.max(chart[3][chart[3].length - 1][2], chart[2][chart[2].length - 1]) * 60 / 16 }, (_, index) => ({
      archetype: 'SliderData',
      data: [],
    }))

    data.entities.push(...ts, ...discL, ...discR, ...notes, ...bl, ...sd);
    return data;
}

function note(chart: any) {
    let hold: any[] = [];
    let slider: any[] = [];
    let notes: any = {};
    let nots = chart[3].map((arr: any[], i: number) => {
        const not = {
            archetype:
                arr[1] === 0
                    ? "DarkTapNote"
                    : arr[1] === 1
                      ? "LightTapNote"
                      : arr[1] === 2 || arr[1] === 3
                        ? "ScratchNote"
                        : arr[1] === 4
                          ? "StopStartNote"
                          : arr[1] === 5
                            ? "StopEndNote"
                            : arr[1] === 6
                              ? "HoldStartNote"
                              : arr[1] === 8
                                ? "HoldEndNote"
                                : arr[1] === 7
                                  ? "HoldMiddleNote"
                                  : arr[4] !== 0
                                    ? "SliderFlickNote"
                                    : "SliderTickNote",

            data: [
                {
                    name: "#BEAT",
                    value: arr[2],
                },
                {
                    name: "lane",
                    value: arr[0] - 3,
                },
                {
                    name: "timeScaleGroup",
                    ref:
                        arr[0] === 0
                            ? "tsg:1"
                            : arr[0] === 6
                              ? "tsg:2"
                              : "tsg:0",
                },
            ],

            name: `note${i}`,
        };

        notes[arr[2]]
            ? notes[arr[2]].push({ name: `note${i}`, lane: arr[0] })
            : (notes[arr[2]] = [{ name: `note${i}`, lane: arr[0] }]);

        if (arr[3] && (arr[1] === 4 || arr[1] === 6)) {
            let note: any = {};
            note.head = not.name;
            note.tail = `note${arr[3]}`;
            hold.push(note);
            not.data.push({
                name: "tail",
                ref: `note${arr[3]}`,
            });
        }

        if (arr[1] === 9) {
            if (arr[3] > 0) {
                slider.push({ prev: not.name, next: `note${arr[3]}` });
                not.data.push({
                    name: "next",
                    ref: `note${arr[3]}`,
                });
            }

            const sld = slider.find((note) => note.next === not.name);
            if (sld)
                not.data.push({
                    name: "prev",
                    ref: sld.prev,
                });
        }

        if (arr[1] === 5 || arr[1] === 8) {
            not.data.push({
                name: "head",
                ref: hold.find((note) => note.tail === not.name).head,
            });
        }

        if (arr[4])
            not.data.push({
                name: "direction",
                value: arr[4],
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

import { EngineArchetypeDataName, EngineArchetypeName, LevelData } from '@sonolus/core'

export { default as data } from "./chart.json"

export const dat: LevelData = {
    bgmOffset: 0,
    entities: [
        {
            archetype: 'Initialization',
            data: [],
        },
        {
            archetype: 'Stage',
            data: [],
        },
        {
            archetype: "#BPM_CHANGE",
            data: [
                {
                    name: "#BEAT",
                    value: 0
                },
                {
                    name: "#BPM",
                    value: 120
                }
            ]
        },
        {
            archetype: EngineArchetypeName.TimeScaleChange,
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 2
                },
                {
                    name: EngineArchetypeDataName.TimeScale,
                    value: 0
                }
            ]
        },
        {
            archetype: EngineArchetypeName.TimeScaleChange,
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 20
                },
                {
                    name: EngineArchetypeDataName.TimeScale,
                    value: 1
                }
            ]
        },
        {
            archetype: "StopStartNote",
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 2
                },
                {
                    name: "lane",
                    value: 3
                },
                {
                    name: "tail",
                    ref: "st1"
                }
            ],
            name: "sh1"
        },
        {
            archetype: "HoldConnector",
            data: [
                {
                    name: "head",
                    ref: "sh1"
                },
                {
                    name: "tail",
                    ref: "st1"
                }
            ]
        },
        {
            archetype: "StopEndNote",
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 12
                },
                {
                    name: "lane",
                    value: 3
                },
                {
                    name: "head",
                    ref: "sh1"
                }
            ],
            name: "st1"
        },
        {
            archetype: "StopStartNote",
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 3
                },
                {
                    name: "lane",
                    value: -3
                },
                {
                    name: "tail",
                    ref: "st2"
                }
            ],
            name: "sh2"
        },
        {
            archetype: "HoldConnector",
            data: [
                {
                    name: "head",
                    ref: "sh2"
                },
                {
                    name: "tail",
                    ref: "st2"
                }
            ]
        },
        {
            archetype: "StopEndNote",
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 4
                },
                {
                    name: "lane",
                    value: -3
                },
                {
                    name: "head",
                    ref: "sh2"
                }
            ],
            name: "st2"
        },
        {
            archetype: "StopStartNote",
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 5
                },
                {
                    name: "lane",
                    value: -3
                },
                {
                    name: "tail",
                    ref: "st3"
                }
            ],
            name: "sh3"
        },
        {
            archetype: "HoldConnector",
            data: [
                {
                    name: "head",
                    ref: "sh3"
                },
                {
                    name: "tail",
                    ref: "st3"
                }
            ]
        },
        {
            archetype: "StopEndNote",
            data: [
                {
                    name: EngineArchetypeDataName.Beat,
                    value: 6
                },
                {
                    name: "lane",
                    value: -3
                },
                {
                    name: "head",
                    ref: "sh3"
                }
            ],
            name: "st3"
        },
    ],
}

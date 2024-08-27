export function parse(chart) {
    let sus = { bgmOffset: 0, entities: [
        {
            archetype: "Initialization",
            data: []
        },
        {
            archetype: "Stage",
            data: []
        },
        {
            archetype: "#BPM_CHANGE",
            data: [
                {
                    name: "#TIME",
                    value: 0
                },
                {
                    name: "#BPM",
                    value: 60
                }
            ]
        },
        {
            archetype: "TimeScaleGroup",
            data: [
                {
                    name: "first",
                    ref: "tsc:0:0"
                },
                {
                    name: "length",
                    value: chart[1].length + 1
                },
                {
                    name: "next",
                    ref: "tsg:1"
                }
            ],
            name: "tsg:0"
        },
        {
            archetype: "TimeScaleGroup",
            data: [
                {
                    name: "first",
                    ref: "tsc:1:0"
                },
                {
                    name: "length",
                    value: 1
                },
                {
                    name: "next",
                    ref: "tsg:2"
                }
            ],
            name: "tsg:1"
        },
        {
            archetype: "TimeScaleGroup",
            data: [
                {
                    name: "first",
                    ref: "tsc:2:0"
                },
                {
                    name: "length",
                    value: 1
                },
                {
                    name: "next",
                    ref: "tsg:3"
                }
            ],
            name: "tsg:2"
        },
        {
            archetype: "TimeScaleChange",
            data: [
                {
                    name: "#BEAT",
                    value: 0
                },
                {
                    name: "timeScale",
                    value: 1
                },
                {
                    name: "next",
                    ref: `tsc:0:1`
                }
            ],
            name: `tsc:0:0`
        },
        {
            archetype: "TimeScaleChange",
            data: [
                {
                    name: "#BEAT",
                    value: 0
                },
                {
                    name: "timeScale",
                    value: 1
                },
                {
                    name: "next",
                    value: -1
                }
            ],
            name: `tsc:1:0`
        },
        {
            archetype: "TimeScaleChange",
            data: [
                {
                    name: "#BEAT",
                    value: 0
                },
                {
                    name: "timeScale",
                    value: 1
                },
                {
                    name: "next",
                    value: -1
                }
            ],
            name: `tsc:2:0`
        },
    ]}

    let ts = chart[1].map((arr, i) => ({
        archetype: "TimeScaleChange",
        data: [
            {
                name: "#BEAT",
                value: arr[0]
            },
            {
                name: "timeScale",
                value: arr[1]
            },
            {
                name: "disc",
                value: arr[2]
            },
            {
                name: "next",
                ref: `tsc:0:${i + 2}`
            }
        ],
        name: `tsc:0:${i + 1}`
    }))
    let bl = chart[2].map(time => ({
        archetype: "BarLine",
        data: [
            {
                name: "#BEAT",
                value: time
            },
            {
                name: "timeScaleGroup",
                ref: "tsg:0"
            }
        ]
    }))
    let notes = note(chart)

    sus.entities.push(...ts, ...notes, ...bl)
    return sus
}

function note(chart) {
    let hold = []
    let slider = []
    let notes = {}
    let sol = chart[3].map((arr, i) => {
        const sus = {
            archetype: 
                (arr[1] === 0) ? "DarkTapNote" :
                (arr[1] === 1) ? "LightTapNote" :
                (arr[1] === 2 || arr[1] === 3) ? "ScratchNote" :
                (arr[1] === 4) ? "StopStartNote" :
                (arr[1] === 5) ? "StopEndNote" :
                (arr[1] === 6) ? "HoldStartNote" :
                (arr[1] === 8) ? "HoldEndNote" :
                (arr[1] === 7) ? "HoldMiddleNote" :
                (arr[4] !== 0) ? "SliderFlickNote" : "SliderTickNote",
            
            data: [
                {
                    name: "#BEAT",
                    value: arr[2],
                },
                {
                    name: "lane",
                    value: arr[0] - 3
                },
                {
                    name: "timeScaleGroup",
                    ref: (arr[0] === 0) ? "tsg:1" : (arr[0] === 6) ? "tsg:2" : "tsg:0"
                }
            ],

            name: `note${i}`
        }

        notes[arr[2]] ? notes[arr[2]].push({ name: `note${i}`, lane: arr[0] }) : notes[arr[2]] = [{ name: `note${i}`, lane: arr[0] }]

        if (arr[3] && ((arr[1] === 4) || (arr[1] === 6))) {
            let note = {}
            note.head = sus.name
            note.tail = `note${arr[3]}`
            hold.push(note)
            sus.data.push({
                name: "tail",
                ref: `note${arr[3]}`
            })
        }

        if (arr[1] === 9) {
            if (arr[3] > 0) {
                slider.push({ prev: sus.name, next: `note${arr[3]}` })
                sus.data.push({
                    name: "next",
                    ref: `note${arr[3]}`
                })
            }

            const sld = slider.find(note => note.next === sus.name)
            if (sld) sus.data.push({
                name: "prev",
                ref: sld.prev
            })
        }

        if ((arr[1] === 5) || (arr[1] === 8)) {
            sus.data.push({
                name: "head",
                ref: hold.find(note => note.tail === sus.name).head
            })
        }

        if (arr[4]) sus.data.push({
            name: "direction",
            value: arr[4]
        })

        return sus
    })

    hold.forEach(({ head, tail }, i) => sol.splice(parseInt(head.replace("note", "")) + 1 + i, 0, {
        archetype: "HoldConnector",
        data: [
            {
                name: "head",
                ref: head
            },
            {
                name: "tail",
                ref: tail
            }
        ]
    }))

    for (const beat in notes) {
        const sim = notes[beat].sort((a, b) => a.lane - b.lane)
        if (sim.length === 2) {
            sol.push({
                archetype: "SimLine",
                data: [
                    {
                        name: "a",
                        ref: sim[0].name
                    },
                    {
                        name: "b",
                        ref: sim[1].name
                    }
                ]
            })
        } else if (sim.length === 3) {
            sol.push({
                archetype: "SimLine",
                data: [
                    {
                        name: "a",
                        ref: sim[0].name
                    },
                    {
                        name: "b",
                        ref: sim[1].name
                    }
                ]
            })
            sol.push({
                archetype: "SimLine",
                data: [
                    {
                        name: "a",
                        ref: sim[1].name
                    },
                    {
                        name: "b",
                        ref: sim[2].name
                    }
                ]
            })
        }
    }

    return sol
}

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
        }
    ]}

    let ts = chart[1].map(arr => ({archetype: "#TIMESCALE_CHANGE", data: [{name: "#BEAT", value: arr[0]}, {name: "#TIMESCALE", value: arr[1]}]}))
    let bl = chart[2].map(time => ({archetype: "BarLine", data: [{name: "#BEAT", value: time}]}))
    let notes = note(chart)

    sus.entities.push(...ts, ...notes, ...bl)
    return sus
}

function note(chart) {
    let hold = []
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
            if (arr[3] > 0) sus.data.push({
                name: "next",
                ref: `note${arr[3]}`
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

    sol.push(...hold.map(({ head, tail }) => ({
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
    })))

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

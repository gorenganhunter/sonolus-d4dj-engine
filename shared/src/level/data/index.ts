import { LevelData } from '@sonolus/core'

export { default as data } from "./guru.json"

// export const data: LevelData = {
//     bgmOffset: 0,
//     entities: [
//         {
//             archetype: 'Initialization',
//             data: [],
//         },
//         {
//             archetype: 'Stage',
//             data: [],
//         },
//         {
//             archetype: "#BPM_CHANGE",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 0
//                 },
//                 {
//                     name: "#BPM",
//                     value: 60
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 0.5
//                 },
//                 {
//                     name: "next",
//                     ref: "s2"
//                 },
//                 {
//                     name: "lane",
//                     value: -2
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 1
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 }
//             ],
//             name: "s2"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 1.5
//                 },
//                 {
//                     name: "next",
//                     ref: "s4"
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 2
//                 },
//                 {
//                     name: "lane",
//                     value: 0
//                 }
//             ],
//             name: "s4"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 2.5
//                 },
//                 {
//                     name: "next",
//                     ref: "h"
//                 },
//                 {
//                     name: "lane",
//                     value: 0
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 3
//                 },
//                 {
//                     name: "lane",
//                     value: 1
//                 }
//             ],
//             name: "h"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 3.5
//                 },
//                 {
//                     name: "next",
//                     ref: "s6"
//                 },
//                 {
//                     name: "lane",
//                     value: 1
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 4
//                 },
//                 {
//                     name: "lane",
//                     value: 2
//                 },
//                 {
//                     name: "next",
//                     ref: "s7"
//                 },
//             ],
//             name: "s6"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 4.5
//                 },
//                 {
//                     name: "lane",
//                     value: 1
//                 },
//                 {
//                     name: "next",
//                     ref: "s8"
//                 },
//             ],
//             name: "s7"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 5
//                 },
//                 {
//                     name: "lane",
//                     value: 0
//                 },
//                 {
//                     name: "next",
//                     ref: "s9"
//                 },
//             ],
//             name: "s8"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 5.5
//                 },
//                 {
//                     name: "lane",
//                     value: 1
//                 },
//                 {
//                     name: "next",
//                     ref: "s10"
//                 },
//             ],
//             name: "s9"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 6.5
//                 },
//                 {
//                     name: "lane",
//                     value: 1
//                 },
//                 // {
//                 //     name: "next",
//                 //     ref: "s9"
//                 // },
//             ],
//             name: "s10"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 7
//                 },
//                 {
//                     name: "next",
//                     ref: "i"
//                 },
//                 {
//                     name: "lane",
//                     value: 1
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 7.5
//                 },
//                 {
//                     name: "lane",
//                     value: 0
//                 }
//             ],
//             name: "i"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 8
//                 },
//                 {
//                     name: "next",
//                     ref: "g"
//                 },
//                 {
//                     name: "lane",
//                     value: 0
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 8.5
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 }
//             ],
//             name: "g"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 9
//                 },
//                 {
//                     name: "next",
//                     ref: "s11"
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 }
//             ]
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 9.5
//                 },
//                 {
//                     name: "lane",
//                     value: -2
//                 },
//                 {
//                     name: "next",
//                     ref: "s12"
//                 },
//             ],
//             name: "s11"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 10
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 },
//                 {
//                     name: "next",
//                     ref: "s13"
//                 },
//             ],
//             name: "s12"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 10.5
//                 },
//                 {
//                     name: "lane",
//                     value: 0
//                 },
//                 {
//                     name: "next",
//                     ref: "s14"
//                 },
//             ],
//             name: "s13"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 11
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 },
//                 {
//                     name: "next",
//                     ref: "s15"
//                 },
//             ],
//             name: "s14"
//         },
//         {
//             archetype: "SliderTickNote",
//             data: [
//                 {
//                     name: "#BEAT",
//                     value: 12
//                 },
//                 {
//                     name: "lane",
//                     value: -1
//                 },
//                 // {
//                 //     name: "next",
//                 //     ref: "s9"
//                 // },
//             ],
//             name: "s15"
//         },
//         {
//             archetype: "BarLine",
//             data: [{
//                 name: "#BEAT",
//                 value: 2
//             }]
//         },
//         {
//             archetype: "BarLine",
//             data: [{
//                 name: "#BEAT",
//                 value: 4
//             }]
//         },
//         {
//             archetype: "BarLine",
//             data: [{
//                 name: "#BEAT",
//                 value: 6
//             }]
//         },
//         {
//             archetype: "BarLine",
//             data: [{
//                 name: "#BEAT",
//                 value: 8
//             }]
//         },
//         {
//             archetype: "BarLine",
//             data: [{
//                 name: "#BEAT",
//                 value: 10
//             }]
//         },
//         {
//             archetype: "BarLine",
//             data: [{
//                 name: "#BEAT",
//                 value: 12
//             }]
//         },
//     ],
// }

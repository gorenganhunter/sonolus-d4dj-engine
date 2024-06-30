import { Text } from '@sonolus/core'

/** @satisfies {Record<string, import('@sonolus/core').EngineConfigurationOption>} */
export const optionsDefinition = {
    speed: {
        name: Text.Speed,
        standard: true,
        advanced: true,
        type: 'slider',
        def: 1,
        min: 0.5,
        max: 2,
        step: 0.05,
        unit: Text.PercentageUnit,
    },
    noteSize: {
        name: Text.NoteSize,
        type: 'slider',
        def: 1.5,
        min: 0.5,
        max: 2,
        step: 0.05,
        unit: Text.PercentageUnit,
    },
    noteSpeed: {
        name: Text.NoteSpeed,
        type: "slider",
        def: 2,
        min: 1,
        max: 11.5,
        step: 0.1
    },
    barLine: {
        name: "#BARLINE",
        type: "toggle",
        def: 1
    },
    simLine: {
        name: Text.Simline,
        type: "toggle",
        def: 1
    },
    laneLength: {
        name: Text.Length,
        type: "slider",
        def: 1,
        min: 0,
        max: 1,
        step: 0.05,
        unit: Text.PercentageUnit
    },
    sfxEnabled: {
        name: Text.Effect,
        type: "toggle",
        def: 1
    },
    laneWidth: {
        name: Text.JudgelineSize,
        type: "slider",
        def: 1,
        min: 0.8,
        max: 1.5,
        step: 0.
    },
    noteEffectEnabled: {
        name: Text.NoteEffect,
        type: "toggle",
        def: 1
    },
    // width: {
    //     name: ""
    // },
}

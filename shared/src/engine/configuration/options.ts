import { EngineConfigurationOption, Text } from '@sonolus/core'

export const optionsDefinition = {
    speed: {
        name: Text.Speed,
        standard: true,
        advanced: true,
        type: 'slider',
        def: 1,
        min: 0.5,
        max: 2,
        step: 0.01,
        unit: Text.PercentageUnit,
    },
    backspinAssist: {
        name: "Back-Spin Assist",
        standard: true,
        type: "toggle",
        scope: "d4dj",
        def: 0
    },
    judgmentWidth: {
        name: "Judgement Width",
        standard: true,
        advanced: true,
        type: "slider",
        scope: "d4dj",
        min: 0.5,
        max: 1,
        def: 1,
        step: 0.01,
        unit: Text.PercentageUnit
    },
    // judgmentMode: {
    //     name: "Judgement Mode",
    //     type: "select",
    //     scope: "d4dj",
    //     values: ["Combined", "Separated"],
    //     def: 0
    // },
    // judgelineHeight: {
    //     name: "Judgement Line Height",
    //     type: "slider",
    //     scope: "d4dj",
    //     min: -10,
    //     max: 10,
    //     def: 0,
    //     step: 1
    // },
    mirror: {
        name: Text.Mirror,
        type: 'toggle',
        def: 0,
    },
    noteSpeed: {
        name: Text.NoteSpeed,
        type: "slider",
        scope: "d4dj",
        def: 2,
        min: 1,
        max: 11.5,
        step: 0.1
    },
    noteSize: {
        name: Text.NoteSize,
        type: 'slider',
        scope: "d4dj",
        def: 1.5,
        min: 0.5,
        max: 2,
        step: 0.01,
        unit: Text.PercentageUnit,
    },
    laneLength: {
        name: Text.Length,
        type: "slider",
        scope: "d4dj",
        def: 1,
        min: 0,
        max: 1,
        step: 0.01,
        unit: Text.PercentageUnit
    },
    width: {
        name: "Width",
        type: "slider",
        scope: "d4dj",
        def: 1,
        min: 0.8,
        max: 1.5,
        step: 0.01,
        unit: Text.PercentageUnit
    },
    barLine: {
        name: "Bar Line",
        type: "toggle",
        scope: "d4dj",
        def: 1
    },
    simLine: {
        name: Text.Simline,
        type: "toggle",
        scope: "d4dj",
        def: 1
    },
    opacity: {
        name: "Opacity",
        type: "slider",
        scope: "d4dj",
        def: 0.65,
        min: 0,
        max: 1,
        step: 0.01,
        unit: Text.PercentageUnit
    },
    lineOpacity: {
        name: "Line Opacity",
        type: "slider",
        scope: "d4dj",
        def: 0.9,
        min: 0,
        max: 1,
        step: 0.01,
        unit: Text.PercentageUnit
    },
    connectorAlpha: {
        name: Text.ConnectorAlpha,
        type: "slider",
        scope: "d4dj",
        def: 1,
        min: 0,
        max: 1,
        step: 0.01,
        unit: Text.PercentageUnit
    },
    sfxEnabled: {
        name: Text.Effect,
        type: "toggle",
        scope: "d4dj",
        def: 1
    },
    autoSfx: {
        name: Text.EffectAuto,
        type: "toggle",
        scope: "d4dj",
        def: 0
    },
    noteEffectEnabled: {
        name: Text.NoteEffect,
        type: "toggle",
        scope: "d4dj",
        def: 1
    },
    // backspinBrightness: {
    //     name: "BackSpin Brightness",
    //     type: "slider",
    //     scope: "d4dj",
    //     def: 0.8,
    //     min: 0,
    //     max: 1,
    //     step: 0.01,
    //     unit: Text.PercentageUnit
    // },
    // scratchSensitivity: {
    //     name: "Scratch Sensitivity",
    //     type: "slider",
    //     scope: "d4dj",
    //     min: -2,
    //     max: 2,
    //     def: 0,
    //     step: 1
    // }
} satisfies Record<string, EngineConfigurationOption>

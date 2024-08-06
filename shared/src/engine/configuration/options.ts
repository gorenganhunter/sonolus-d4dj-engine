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
        type: "toggle",
        scope: "d4dj",
        def: 0
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
    }
} satisfies Record<string, EngineConfigurationOption>

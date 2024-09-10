import { SkinSpriteName } from '@sonolus/core'

export const skin = defineSkin({
    sprites: {
        judgeLine: SkinSpriteName.JudgmentLine,
        djStage: "DJ Stage",
        lane: SkinSpriteName.Lane,
        laneAlt: SkinSpriteName.LaneAlternative,
        slot: SkinSpriteName.NoteSlot,
        line: "DJ Line",
        simLine: SkinSpriteName.SimultaneousConnectionNeutral,
        splitLine: SkinSpriteName.GridNeutral,

        borderRight: SkinSpriteName.StageRightBorder,
        borderLeft: SkinSpriteName.StageLeftBorder,
        borderBottom: SkinSpriteName.StageBottomBorder,

        darkTapNote: SkinSpriteName.NoteHeadBlue,
        lightTapNote: SkinSpriteName.NoteHeadCyan,

        holdHead: SkinSpriteName.NoteHeadYellow,
        holdTail: SkinSpriteName.NoteTailYellow,
        holdConnector: SkinSpriteName.NoteConnectionYellow,

        scratch: "DJ Scratch Note",
        scratchArrow: "DJ Scratch Arrow",
        scratchFallback: SkinSpriteName.NoteHeadGreen,
        scratchArrowFallback: SkinSpriteName.DirectionalMarkerGreen,

        stopHead: SkinSpriteName.NoteHeadRed,
        stopTail: SkinSpriteName.NoteTailRed,
        stopConnector: SkinSpriteName.NoteConnectionRed,

        sliderNote: SkinSpriteName.NoteTickPurple,
        sliderConnector: SkinSpriteName.NoteConnectionPurple,
        sliderArrow: SkinSpriteName.DirectionalMarkerPurple,
        slider: "DJ Slider",
        sliderBar: "DJ Slider Bar",
        sliderFallback: SkinSpriteName.NoteHeadNeutral,
        sliderBarFallback: SkinSpriteName.GridNeutral
    },
})

export const layer = {
    note: {
        arrow: 101,
        body: 100,
        connector: 99
    },

    simLine: 90,

    line: 91,

    stage: 0,
}

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000

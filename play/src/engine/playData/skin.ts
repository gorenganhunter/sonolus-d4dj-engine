import { SkinSpriteName } from '@sonolus/core'

export const skin = defineSkin({
    sprites: {
        judgeLine: SkinSpriteName.JudgmentLine,
        lane: SkinSpriteName.Lane,
        slot: SkinSpriteName.NoteSlot,
        line: "DJ Line",
        simLine: SkinSpriteName.SimultaneousConnectionNeutral,

        borderBottom: SkinSpriteName.StageBottomBorder,

        darkTapNote: SkinSpriteName.NoteHeadBlue,
        lightTapNote: SkinSpriteName.NoteHeadCyan,

        holdHead: SkinSpriteName.NoteHeadYellow,
        holdTail: SkinSpriteName.NoteTailYellow,
        holdConnector: SkinSpriteName.NoteConnectionYellow,

        scratch: "DJ Scratch Note",
        scratchArrow: "DJ Scratch Arrow",

        stopHead: SkinSpriteName.NoteHeadRed,
        stopTail: SkinSpriteName.NoteTailRed,
        stopConnector: SkinSpriteName.NoteConnectionRed,

        sliderNote: SkinSpriteName.NoteTickPurple,
        sliderConnector: SkinSpriteName.NoteConnectionPurple,
        sliderArrow: SkinSpriteName.DirectionalMarkerPurple,
        slider: "DJ Slider",
        sliderBar: "DJ Slider Bar"
    },
})

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000

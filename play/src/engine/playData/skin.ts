import { SkinSpriteName } from '@sonolus/core'

export const skin = defineSkin({
    renderMode: 'lightweight',
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
        sliderArrowGlow: "DJ Slider Arrow Glow",
        slider: "DJ Slider",
        sliderBar: "DJ Slider Bar",
        sliderFallback: SkinSpriteName.NoteHeadNeutral,
        sliderBarFallback: SkinSpriteName.GridNeutral,

        shadow: "DJ Shadow",
        shadowNote: "DJ Shadow Note",
        shadowSlider: "DJ Shadow Slider",
        shadowSliderArrow: "DJ Shadow Slider Arrow",

        turntableBase: "DJ Turntable Base",
        turntableRed: "DJ Turntable Red",
        turntableOrange: "DJ Turntable Orange",

        diskOutside: "DJ Disk Outside",
        diskInside: "DJ Disk Inside"
    },
})

export const getZ = (layer: number, time: number, lane: number) =>
    layer - time / 1000 - lane / 100000

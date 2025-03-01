import { ParticleEffectName } from '@sonolus/core'
import { perspectiveLayout } from '../../../../shared/src/engine/data/utils.js'

export const particle = defineParticle({
    effects: {
        emptyTap: ParticleEffectName.NoteCircularTapNeutral,

        darkTapNoteLinear: ParticleEffectName.NoteLinearTapBlue,
        darkTapNoteCircular: ParticleEffectName.NoteCircularTapBlue,

        lightTapNoteLinear: ParticleEffectName.NoteLinearTapCyan,
        lightTapNoteCircular: ParticleEffectName.NoteCircularTapCyan,

        holdNoteLinear: ParticleEffectName.NoteLinearTapYellow,
        holdNoteCircular: ParticleEffectName.NoteCircularTapYellow,

        stopNoteLinear: ParticleEffectName.NoteLinearTapRed,
        stopNoteCircular: ParticleEffectName.NoteCircularTapRed,

        laneLinear: ParticleEffectName.LaneLinear,
        laneCircular: ParticleEffectName.LaneCircular,

        slotLinear: ParticleEffectName.SlotLinear,
        slotCircular: ParticleEffectName.SlotCircular,

        holdLinear: ParticleEffectName.NoteLinearHoldYellow,
        holdCircular: ParticleEffectName.NoteCircularHoldYellow,

        stopLinear: ParticleEffectName.NoteCircularHoldRed,
        stopCircular: ParticleEffectName.NoteCircularHoldRed,

        scratchNoteLinear: "DJ Scratch Linear Particle",
        scratchNoteCircular: "DJ Scratch Circular Particle",
        scratchNoteLinearFallback: ParticleEffectName.NoteLinearTapGreen,
        scratchNoteCircularFallback: ParticleEffectName.NoteCircularTapGreen,

        sliderNoteLinear: ParticleEffectName.NoteLinearTapPurple,
        sliderNoteCircular: ParticleEffectName.NoteCircularTapPurple,

        sliderFlick: "DJ Slider Flick Particle"
    },
})

export const effectLayout = ({ lane, w, h }: { lane: number, w: number, h: number }) => {
    return perspectiveLayout({
        l: lane - w,
        r: lane + w,
        t: 1 - h,
        b: 1 + h,
    })
}

// export const linearEffectLayout = ({ lane, size }: { lane: number, size: number }) => {
//     const w = size
//     const h = size

//     return perspectiveLayout({
//         l: lane - w,
//         r: lane + w,
//         t: 1 - h,
//         b: 1 + h,
//     })
// }

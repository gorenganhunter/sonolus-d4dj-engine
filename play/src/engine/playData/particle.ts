import { ParticleEffectName } from '@sonolus/core'
import { perspectiveLayout } from '../../../../shared/src/engine/data/utils.js'

export const particle = defineParticle({
    effects: {
        darkTapNote: ParticleEffectName.NoteLinearTapBlue,
        lightTapNote: ParticleEffectName.NoteLinearTapCyan,
        holdNote: ParticleEffectName.NoteLinearHoldYellow,
        stopNote: ParticleEffectName.NoteLinearHoldRed,
        lane: ParticleEffectName.LaneLinear,
        slot: ParticleEffectName.SlotLinear,
        holdLinear: ParticleEffectName.NoteLinearHoldYellow,
        holdCircular: ParticleEffectName.NoteCircularHoldYellow,
        stopCircular: ParticleEffectName.NoteCircularHoldRed,
        scratch: ParticleEffectName.NoteLinearTapGreen,
        slider: ParticleEffectName.NoteLinearTapPurple
    },
})

export const circularEffectLayout = ({ lane, w, h }: { lane: number, w: number, h: number }) => {
    return perspectiveLayout({
        l: lane - w,
        r: lane + w,
        t: 1 - h,
        b: 1 + h,
    })
}

export const linearEffectLayout = ({ lane, size }: { lane: number, size: number }) => {
    const w = size
    const h = size

    return perspectiveLayout({
        l: lane - w,
        r: lane + w,
        t: 1 - h,
        b: 1 + h,
    })
}

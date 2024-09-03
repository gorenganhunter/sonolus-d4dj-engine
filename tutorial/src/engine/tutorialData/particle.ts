import { ParticleEffectName } from '@sonolus/core'
import { approach, leftRotated, perspectiveLayout, rightRotated } from '../../../../shared/src/engine/data/utils.js'
import { note } from './note.js'

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

        scratchNoteLinear: ParticleEffectName.NoteLinearTapGreen,
        scratchNoteCircular: ParticleEffectName.NoteCircularTapGreen,

        sliderNoteLinear: ParticleEffectName.NoteLinearTapPurple,
        sliderNoteCircular: ParticleEffectName.NoteCircularTapPurple,

        sliderFlick: "DJ Slider Flick Effect"
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

const circularEffectLayout = ({ w, h }: { w: number; h: number }, flick: boolean = false) => {
    const l = -w + (flick ? 6.3 : 0)
    const r = w + (flick ? 6.3 : 0)

    const b = 1 + h * note.radius
    const t = 1 - h * note.radius

    return new Rect({ l, r, b, t })
}

const linearEffectLayout = (flick: boolean = false) =>
    new Rect({
        l: -0.5 + (flick ? 6.3 : 0),
        r: 0.5 + (flick ? 6.3 : 0),
        t: 1 - note.radius,
        b: 1,
    })

const leftRotatedLinearEffectLayout = () =>
    leftRotated({
        l: -1,
        r: 0,
        t: 1 - 0.5 * note.radius,
        b: 1 + 0.5 * note.radius,
    })

const rightRotatedLinearEffectLayout = () =>
    rightRotated({
        l: 0,
        r: 1,
        t: 1 - 0.5 * note.radius,
        b: 1 + 0.5 * note.radius,
    })

export const playLinearNoteEffect = (effect: ParticleEffect, flick: boolean = false) =>
    effect.spawn(linearEffectLayout(flick), 0.4, false)

export const playLeftRotatedLinearNoteEffect = (effect: ParticleEffect) =>
    effect.spawn(leftRotatedLinearEffectLayout(), 0.4, false)

export const playRightRotatedLinearNoteEffect = (effect: ParticleEffect) =>
    effect.spawn(rightRotatedLinearEffectLayout(), 0.4, false)

export const playCircularNoteEffect = (effect: ParticleEffect, flick: boolean = false) =>
    effect.spawn(circularEffectLayout({ w: 1.5, h: 1 }, flick), 0.6, false)

export const playLaneEffects = () =>
    particle.effects.laneLinear.spawn(
        perspectiveLayout({ l: -0.5, r: 0.5, b: 0, t: approach(0, 1, 0) }),
        0.2,
        false,
    )

export const spawnCircularHoldEffect = () =>
    particle.effects.holdCircular.spawn(circularEffectLayout({ w: 0.9, h: 0.6 }), 1, true)

export const spawnLinearHoldEffect = () =>
    particle.effects.holdLinear.spawn(linearEffectLayout(), 1, true)
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

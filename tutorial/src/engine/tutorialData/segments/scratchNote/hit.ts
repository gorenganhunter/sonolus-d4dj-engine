import { effect } from '../../effect.js'
import { particle, playCircularNoteEffect, playLaneEffects, playLinearNoteEffect } from '../../particle.js'

export const scratchNoteHit = {
    enter() {
        effect.clips.scratchPerfect.play(0)

        playLinearNoteEffect(particle.effects.scratchNoteLinear, true)
        playCircularNoteEffect(particle.effects.scratchNoteCircular, true)
        playLaneEffects()
    },
}

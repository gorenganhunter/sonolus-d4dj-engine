import { effect } from '../../effect.js'
import { particle, playCircularNoteEffect, playLaneEffects, playLinearNoteEffect } from '../../particle.js'

export const holdEndNoteHit = {
    enter() {
        effect.clips.longPerfect.exists ? effect.clips.longPerfect.play(0) : effect.clips.perfect.play(0)

        playLinearNoteEffect(particle.effects.holdNoteLinear)
        playCircularNoteEffect(particle.effects.holdNoteCircular)
        playLaneEffects()
    },
}

import { effect } from '../../effect.js'
import { particle, playCircularNoteEffect, playLaneEffects, playLeftRotatedLinearNoteEffect } from '../../particle.js'

export const sliderFlickHit = {
    enter() {
        effect.clips.sliderFlickPerfect.exists ? effect.clips.sliderFlickPerfect.play(0) : effect.clips.perfectAlt.play(0)

        playLeftRotatedLinearNoteEffect(particle.effects.sliderNoteLinear)
        playCircularNoteEffect(particle.effects.sliderNoteCircular)
        playLaneEffects()
    },
}

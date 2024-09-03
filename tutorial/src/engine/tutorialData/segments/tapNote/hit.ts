import { effect } from '../../effect.js'
import {
    particle,
    playCircularNoteEffect,
    playLaneEffects,
    playLinearNoteEffect,
} from '../../particle.js'

export const tapNoteHit = {
    enter() {
        effect.clips.tap1Perfect.play(0)

        playLinearNoteEffect(particle.effects.darkTapNoteLinear)
        playCircularNoteEffect(particle.effects.darkTapNoteCircular)
        playLaneEffects()
    },
}

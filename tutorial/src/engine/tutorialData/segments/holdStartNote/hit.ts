import { connector } from '../../components/connector.js'
import { slide } from '../../components/slide.js'
import { effect } from '../../effect.js'
import {
    playCircularNoteEffect,
    playLinearNoteEffect,
    spawnCircularHoldEffect,
    spawnLinearHoldEffect,
} from '../../particle.js'
import { drawHand } from '../../instruction.js'
import { particle } from '../../particle.js'

let sfxInstanceId = tutorialMemory(LoopedEffectClipInstanceId)
const effectInstanceIds = tutorialMemory({
    circular: ParticleEffectInstanceId,
    linear: ParticleEffectInstanceId,
})

export const holdStartNoteHit = {
    enter() {
        slide.show("hold")
        connector.showFrozen("hold")

        effect.clips.longPerfect.exists ? effect.clips.longPerfect.play(0) : effect.clips.perfect.play(0)

        playLinearNoteEffect(particle.effects.holdNoteLinear)
        playCircularNoteEffect(particle.effects.holdNoteCircular)

        sfxInstanceId = effect.clips.longLoop.loop()
        effectInstanceIds.circular = spawnCircularHoldEffect()
        effectInstanceIds.linear = spawnLinearHoldEffect()
    },

    update() {
        drawHand(Math.PI / 3, 0, 0, 1)
    },

    exit() {
        slide.clear()
        connector.clear()

        effect.clips.stopLoop(sfxInstanceId)
        particle.effects.destroy(effectInstanceIds.circular)
        particle.effects.destroy(effectInstanceIds.linear)
    },
}

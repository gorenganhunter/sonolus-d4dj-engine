import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { linearEffectLayout, circularEffectLayout, particle } from '../particle.js'
import { archetypes } from './index.js'

const Hold = {
    clipInstanceId: LoopedEffectClipInstanceId,
    effectInstanceIds: {
        circular: ParticleEffectInstanceId,
        linear: ParticleEffectInstanceId,
    },
}

const holds = levelMemory({
    queue: Collection(16, Number),
    old: Dictionary(16, Number, Hold),
    now: Dictionary(16, Number, Hold),
})

export const queueHold = (id: number) => holds.queue.add(id)

export const moveHold = (id: number, lane: number) => {
    const index = holds.old.indexOf(id)
    if (index === -1) return

    const hold = holds.old.getValue(index)

    moveCircularHoldEffect(hold.effectInstanceIds.circular, lane)
    moveLinearHoldEffect(hold.effectInstanceIds.linear, lane)
}

export class HoldManager extends SpawnableArchetype({}) {
    updateSequential() {
        for (const [id, hold] of holds.old) {
            const note = archetypes.HoldStartNote.import.get(id)
            if (holds.queue.has(id)) {
                holds.now.set(id, hold)
            } else {
                if (note.lane != -3 && note.lane != 3) stopHoldSFX(hold.clipInstanceId)
                destroyCircularHoldEffect(hold.effectInstanceIds.circular)
                destroyLinearHoldEffect(hold.effectInstanceIds.linear)
            }
        }

        for (const id of holds.queue) {
            if (holds.now.has(id)) continue

            const note = archetypes.HoldStartNote.import.get(id)
            holds.now.set(id, {
                clipInstanceId: (note.lane != -3 && note.lane != 3) ? playHoldSFX() : 0,
                effectInstanceIds: {
                    circular: spawnCircularHoldEffect(note.lane),
                    linear: spawnLinearHoldEffect(note.lane),
                },
            })
        }

        holds.queue.clear()
        holds.now.copyTo(holds.old)
        holds.now.clear()
    }
}

const shouldPlay = {
    get holdSFX() {
        return options.sfxEnabled && effect.clips.longLoop.exists && !options.autoSfx
    },

    get circularHoldEffect() {
        return options.noteEffectEnabled && particle.effects.holdCircular.exists
    },

    get linearHoldEffect() {
        return options.noteEffectEnabled && particle.effects.holdLinear.exists
    },
}

const playHoldSFX = () => {
    if (!shouldPlay.holdSFX) return 0

    return effect.clips.longLoop.loop()
}

const spawnCircularHoldEffect = (lane: number) => {
    if (!shouldPlay.circularHoldEffect) return 0

    return (lane === -3 || lane === 3) ? particle.effects.stopCircular.spawn(Quad.zero, 1, true) : particle.effects.holdCircular.spawn(Quad.zero, 1, true)
}

const spawnLinearHoldEffect = (lane: number) => {
    if (!shouldPlay.linearHoldEffect) return 0

    return (lane === -3 || lane === 3) ? particle.effects.stopLinear.spawn(Quad.zero, 1, true) : particle.effects.holdLinear.spawn(Quad.zero, 1, true)
}

const moveCircularHoldEffect = (id: ParticleEffectInstanceId, lane: number) => {
    if (!shouldPlay.circularHoldEffect) return

    const layout = circularEffectLayout({
        lane,
        w: 1.05,
        h: 0.8,
    })

    particle.effects.move(id, layout)
}

const moveLinearHoldEffect = (id: ParticleEffectInstanceId, lane: number) => {
    if (!shouldPlay.linearHoldEffect) return

    const layout = linearEffectLayout({
        lane,
        size: 1.05
    })

    particle.effects.move(id, layout)
}

const stopHoldSFX = (id: LoopedEffectClipInstanceId) => {
    if (!shouldPlay.holdSFX) return

    effect.clips.stopLoop(id)
}

const destroyCircularHoldEffect = (id: ParticleEffectInstanceId) => {
    if (!shouldPlay.circularHoldEffect) return

    particle.effects.destroy(id)
}

const destroyLinearHoldEffect = (id: ParticleEffectInstanceId) => {
    if (!shouldPlay.linearHoldEffect) return

    particle.effects.destroy(id)
}

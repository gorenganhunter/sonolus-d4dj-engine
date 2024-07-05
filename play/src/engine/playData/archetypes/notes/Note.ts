import { EngineArchetypeDataName, SkinSpriteName } from '@sonolus/core'
import { approach, perspectiveLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { buckets } from '../../buckets.js'
import { effect } from '../../effect.js'
import { note } from '../../note.js'
import { windows } from '../../windows.js'
import { isUsed, markAsUsed } from '../InputManager.js'
import { skin } from '../../skin.js'
import { particle } from '../../particle.js'

export abstract class Note extends Archetype {
    abstract sprite: SkinSprite
    abstract effect: ParticleEffect
    abstract sfx: {
        perfect: EffectClip,
        great: EffectClip,
        good: EffectClip,
    }
    abstract bucket: Bucket
    
    export = this.defineExport({
        accuracyDiff: { name: 'accuracyDiff', type: Number },
    })

    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
    })

    targetTime = this.entityMemory(Number)
    spawnTime = this.entityMemory(Number)
    visualTime = this.entityMemory({
        min: Number,
        max: Number,
    })
    inputTime = this.entityMemory({
        min: Number,
        max: Number,
    })
    notePosition = this.entityMemory(Quad)
    y = this.entityMemory(Number)
    z = this.entityMemory(Number)
    hitbox = this.entityMemory(Rect)

    playEffect() {
        this.effect.spawn(this.notePosition, 0.2, false)
        // particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    }

    drawNote() {
        this.sprite.draw(this.notePosition.mul(this.y), this.z, 1)
    }

    touchOrder = 1

    hasInput = true

    initialize() {
        this.inputTime.min = this.targetTime + windows.good.min + input.offset
        this.inputTime.max = this.targetTime + windows.good.max + input.offset

        this.z = 1000 - this.targetTime

        this.result.accuracy = windows.good.max

        new Rect({ l: this.import.lane === -3 ? -11.15 : this.import.lane * 2.1 - 1.05 - 0.25, r: this.import.lane === 3 ? 11.15 : this.import.lane * 2.1 + 1.05 + 0.25, b: 2, t: -1 }).transform(skin.transform).copyTo(this.hitbox)
    }

    preprocess() {
        this.targetTime = bpmChanges.at(this.import.beat).time

        this.visualTime.max = (this.import.lane === -3 || this.import.lane === 3) ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime

        // const timescale = timeScaleChanges.at(this.targetTime)

        this.visualTime.min = (this.import.lane === -3 || this.import.lane === 3) ? (this.visualTime.max - note.duration /* (this.targetTime - timescale.startingTime) - */ /* (timescale.startingTime - timescale.startingScaledTime) */ ) : (this.visualTime.max - note.duration)
        this.spawnTime = this.visualTime.min

        // debug.log(this.spawnTime)
    }

    globalPreprocess() {
        const toMS = (window: JudgmentWindow) => ({
            min: window.min * 1000,
            max: window.max * 1000,
        })

        this.bucket.set({
            perfect: toMS(windows.perfect),
            great: toMS(windows.great),
            good: toMS(windows.good),
        })

        this.life.set({
            perfect: 0,
            great: 0,
            good: 0,
            miss: -100,
        })
    }

    spawnOrder() {
        return 1000 + ((this.import.lane === -3 || this.import.lane === 3) ? timeScaleChanges.at(this.spawnTime).scaledTime : this.spawnTime)
    }

    shouldSpawn() {
        return ((this.import.lane === -3 || this.import.lane === 3) ? time.now : time.scaled) >= this.spawnTime
    }

    incomplete(hitTime: number) {
        this.export('accuracyDiff', hitTime - this.result.accuracy - this.targetTime)
        this.despawn = true
    }

    updateParallel() {
        if (time.now > this.inputTime.max) this.despawn = true
        if (this.despawn) return

        // debug.log(this.import.beat)

        this.y = approach(this.visualTime.min, this.visualTime.max, (this.import.lane === -3 || this.import.lane === 3) ? time.now : time.scaled)

        const l = this.import.lane * 2.1 - 1.05 - 0.25
        const r = this.import.lane * 2.1 + 1.05 + 0.25

        perspectiveLayout({ l, r, b: 1 + note.radius, t: 1 - note.radius }).copyTo(this.notePosition)

        this.drawNote()
    }
}

import { EngineArchetypeDataName, SkinSpriteName } from '@sonolus/core'
import { approach, perspectiveLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { buckets } from '../../buckets.js'
import { effect, getScheduleSFXTime } from '../../effect.js'
import { note } from '../../note.js'
import { windows } from '../../windows.js'
import { isUsed, markAsUsed } from '../InputManager.js'
import { skin } from '../../skin.js'
import { particle } from '../../particle.js'
import { scaledTimeToEarliestTime, timeToScaledTime } from '../utils.js'

export abstract class Note extends Archetype {
    abstract sprite: SkinSprite
    abstract effect: {
        linear: ParticleEffect,
        circular: ParticleEffect
    }
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
        timescaleGroup: { name: "timeScaleGroup", type: Number }
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
    scheduleSFXTime = this.entityMemory(Number)
    hasSFXScheduled = this.entityMemory(Boolean)

    playEffect() {
        if (!options.noteEffectEnabled) return

        this.effect.linear.spawn(this.notePosition, 0.2, false)
        this.effect.circular.spawn(this.notePosition, 0.2, false)
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

        new Rect({ l: this.import.lane === -3 ? -15 : this.import.lane * 2.1 - 2.1, r: this.import.lane === 3 ? 15 : this.import.lane * 2.1 + 2.1, b: 2, t: -1 }).transform(skin.transform).copyTo(this.hitbox)
    }

    preprocess() {
        if (options.mirror) this.import.lane *= -1

        this.targetTime = bpmChanges.at(this.import.beat).time

        this.scheduleSFXTime = getScheduleSFXTime(this.targetTime)
    
        this.visualTime.max = options.backspinAssist ? this.targetTime : timeToScaledTime(this.targetTime, this.import.timescaleGroup)

        this.visualTime.min = this.visualTime.max - note.duration
        this.spawnTime = options.backspinAssist ? this.visualTime.min : scaledTimeToEarliestTime(
            Math.min(
                this.visualTime.min,
                this.visualTime.max,
                timeToScaledTime(this.scheduleSFXTime, this.import.timescaleGroup)
            ),
            this.import.timescaleGroup
        )

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
        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return time.now >= this.spawnTime
    }

    incomplete(hitTime: number) {
        this.export('accuracyDiff', hitTime - this.result.accuracy - this.targetTime)
        this.despawn = true
    }
    
    get shouldScheduleSFX() {
        return options.sfxEnabled && options.autoSfx
    }

    get shouldPlaySFX() {
        return options.sfxEnabled && !options.autoSfx
    }

    scheduleSFX() {
        this.hasSFXScheduled = true
        this.sfx.perfect.schedule(this.targetTime, 0.02)
    }

    playSFX() {
        if (!this.shouldPlaySFX) return

        switch (this.result.judgment) {
            case Judgment.Perfect:
                this.sfx.perfect.play(0.02)
                break
            case Judgment.Great:
                this.sfx.great.play(0.02)
                break
            case Judgment.Good:
                this.sfx.good.play(0.02)
                break
        }
    }

    updateParallel() {
        if (time.now > this.inputTime.max) this.despawn = true
        if (this.despawn) return

        if (this.shouldScheduleSFX && !this.hasSFXScheduled && time.now >= this.scheduleSFXTime) this.scheduleSFX()
        // debug.log(this.import.beat)

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)
        if (scaledTime < this.visualTime.min + ((1 - options.laneLength) * note.duration)) return

        this.y = approach(this.visualTime.min, this.visualTime.max, scaledTime)

        const l = this.import.lane * 2.1 - (1.05 * options.noteSize)
        const r = this.import.lane * 2.1 + (1.05 * options.noteSize)

        perspectiveLayout({ l, r, b: 1 + note.radius, t: 1 - note.radius }).copyTo(this.notePosition)

        this.drawNote()
    }
}

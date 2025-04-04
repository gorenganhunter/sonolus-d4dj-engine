import { EngineArchetypeDataName, SkinSpriteName } from '@sonolus/core'
import { approach, perspectiveLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { buckets } from '../../buckets.js'
import { effect } from '../../effect.js'
import { note, getSpawnTime, getBackspinTime } from '../../note.js'
import { toBucketWindows, toWindows, windows } from '../../../../../../shared/src/engine/data/windows.js'
// import { isUsed, markAsUsed } from '../InputManager.js'
import { skin } from '../../skin.js'
import { circularEffectLayout, linearEffectLayout, particle } from '../../particle.js'
import { scaledTimeToEarliestTime, timeToScaledTime } from '../timeScale.js'

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
        fallback: {
            perfect: EffectClip,
            great: EffectClip,
            good: EffectClip,
        }
    }
    abstract bucket: Bucket

    shadow = skin.sprites.shadowNote
    
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
        timescaleGroup: { name: 'timeScaleGroup', type: Number },
        judgment: { name: EngineArchetypeDataName.Judgment, type: DataType<Judgment> },
        accuracy: { name: EngineArchetypeDataName.Accuracy, type: Number },
    })

    initialized = this.entityMemory(Boolean)
    targetTime = this.entityMemory(Number)
    visualTime = this.entityMemory(Range)
    notePosition = this.entityMemory(Quad)
    y = this.entityMemory(Number)
    z = this.entityMemory(Number)
    bsTime = this.entityMemory(Number)
    sharedMemory = this.defineSharedMemory({
        despawnTime: Number
    })
    
    get hitTime() {
        return this.targetTime + this.import.accuracy
    }
    
    get windows() {
        return toWindows(windows, options.strictJudgment)
    }

    spawnTime() {
        return options.backspinAssist ? this.visualTime.min : Math.min(
            replay.isReplay ? this.hitTime : this.targetTime,
            scaledTimeToEarliestTime(
                Math.min(
                    this.visualTime.min,
                    this.visualTime.max,
                    timeToScaledTime(this.targetTime, this.import.timescaleGroup)
                ),
                this.import.timescaleGroup
            )
        )
    }

    despawnTime() {
        return replay.isReplay ? this.hitTime : this.targetTime
    }

    playEffect() {
        if (!options.noteEffectEnabled) return

        const lane = this.import.lane * 2.1

        this.effect.linear.spawn(linearEffectLayout({
            lane,
            size: 1.05
        }), 0.6, false)
        this.effect.circular.spawn(circularEffectLayout({
            lane,
            w: 1.05,
            h: 0.8
        }), 0.6, false)
        // particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    }

    drawNote() {
        this.sprite.draw(this.notePosition.mul(this.y), this.z, 1)
        if (time.now < this.bsTime) this.shadow.draw(this.notePosition.mul(this.y), this.z + 1, 1 - options.backspinBrightness)
    }

    touchOrder = 1

    hasInput = true

    initialize() {
        if (this.initialized) return
        this.initialized = true

        this.z = 1000 - this.targetTime

        const l = this.import.lane * 2.1 - (1.05 * options.noteSize)
        const r = this.import.lane * 2.1 + (1.05 * options.noteSize)

        perspectiveLayout({ l, r, b: 1 + note.radius, t: 1 - note.radius }).copyTo(this.notePosition)
    }

    preprocess() {
        if (options.mirror) this.import.lane *= -1

        this.targetTime = bpmChanges.at(this.import.beat).time

        this.visualTime.copyFrom(Range.l.mul(note.duration).add(options.backspinAssist ? this.targetTime : timeToScaledTime(this.targetTime, this.import.timescaleGroup)))

        this.sharedMemory.despawnTime = this.targetTime

        this.result.time = this.targetTime

        this.bsTime = getBackspinTime(this.targetTime, this.import.timescaleGroup)

        if (replay.isReplay) {
            switch (this.import.judgment) {
                case Judgment.Perfect:
                    this.sfx.perfect.exists ? this.sfx.perfect.schedule(this.hitTime, 0.02) : this.sfx.fallback.perfect.schedule(this.hitTime, 0.02)
                    break
                case Judgment.Great:
                    this.sfx.great.exists ? this.sfx.great.schedule(this.hitTime, 0.02) : this.sfx.fallback.great.schedule(this.hitTime, 0.02)
                    break
                case Judgment.Good:
                    this.sfx.good.exists ? this.sfx.good.schedule(this.hitTime, 0.02) : this.sfx.fallback.good.schedule(this.hitTime, 0.02)
                    break
            }
        } else {
            this.sfx.perfect.exists ? this.sfx.perfect.schedule(this.targetTime, 0.02) : this.sfx.fallback.perfect.schedule(this.targetTime, 0.02)
        }

        if (!replay.isReplay) {
            this.result.bucket.index = this.bucket.index
        } else if (this.import.judgment) {
            this.result.bucket.index = this.bucket.index
            this.result.bucket.value = this.import.accuracy * 1000
        }
    }

    terminate() {
        if (time.skip) return
        if (replay.isReplay && !this.import.judgment) return

        this.playEffect()
        // this.effect.spawn(this.notePosition, 0.3, false)
    }

    globalPreprocess() {
        this.bucket.set(toBucketWindows(this.windows))

        this.life.set({
            perfect: 0,
            great: 0,
            good: 0,
            miss: -100,
        })
    }

    updateParallel() {
        // if (this.visualTime.min > ((this.import.lane === -3 || this.import.lane === 3 || options.backspinAssist) ? time.now : time.scaled)) return
        // debug.log(this.import.beat)

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)
        if (scaledTime < (this.visualTime.min + ((1 - options.laneLength) * note.duration))) return

        this.y = approach(this.visualTime.min, this.visualTime.max, scaledTime)

        this.drawNote()
    }
}

import { EngineArchetypeDataName, SkinSpriteName } from '@sonolus/core'
import { approach, perspectiveLayout } from '../../../../../../shared/src/engine/data/utils.js'
import { options } from '../../../configuration/options.js'
import { buckets } from '../../buckets.js'
import { effect } from '../../effect.js'
import { getBackspinTime, note } from '../../note.js'
import { toBucketWindows, toWindows, windows } from '../../../../../../shared/src/engine/data/windows.js'
import { inputNoteIndexes, isUsed, markAsUsed } from '../InputManager.js'
import { skin } from '../../skin.js'
import { circularEffectLayout, linearEffectLayout, particle } from '../../particle.js'
import { scaledTimeToEarliestTime, timeToScaledTime } from '../utils.js'
import { archetypes } from '../index.js'

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
    visualTime = this.entityMemory(Range)
    inputTime = this.entityMemory(Range)
    notePosition = this.entityMemory(Quad)
    y = this.entityMemory(Number)
    z = this.entityMemory(Number)
    hitbox = this.defineSharedMemory(Rect)
    scheduleSFXTime = this.entityMemory(Number)
    hasSFXScheduled = this.entityMemory(Boolean)
    bsTime = this.entityMemory(Number)

    getHitbox() {
        let hitbox: Rect = new Rect()
        this.hitbox.copyTo(hitbox)
        const mid = (this.hitbox.l + this.hitbox.r) / 2
        for (const index of inputNoteIndexes) {
            if (this.index === index) continue
            const otherImport = this.import.get(index)
            const otherInfo = entityInfos.get(index)

            if (otherInfo.state === EntityState.Despawned || otherImport.beat !== this.import.beat) continue
            
            const otherHitbox = this.hitbox.get(index)
            const otherMid = (otherHitbox.l + otherHitbox.r) / 2

            if (otherMid > mid && this.hitbox.r > otherHitbox.l) hitbox.r = (this.hitbox.r + otherHitbox.l) / 2
            else if (otherMid < mid && this.hitbox.l < otherHitbox.r) hitbox.l = (this.hitbox.l + otherHitbox.r) / 2
        }

        return hitbox
    }

    get windows() {
        return toWindows(windows, options.strictJudgment)
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
        this.inputTime.min = this.targetTime + this.windows.good.min + input.offset
        this.inputTime.max = this.targetTime + this.windows.good.max + input.offset

        this.z = 1000 - this.targetTime

        this.result.accuracy = this.windows.good.max

        const l = this.import.lane * 2.1 - (1.05 * options.noteSize)
        const r = this.import.lane * 2.1 + (1.05 * options.noteSize)

        perspectiveLayout({ l, r, b: 1 + note.radius, t: 1 - note.radius }).copyTo(this.notePosition)
    }

    preprocess() {
        if (options.mirror) this.import.lane *= -1

        this.targetTime = bpmChanges.at(this.import.beat).time
    
        this.visualTime.copyFrom(Range.l.mul(note.duration).add(options.backspinAssist ? this.targetTime : timeToScaledTime(this.targetTime, this.import.timescaleGroup)))

        this.bsTime = getBackspinTime(this.targetTime, this.import.timescaleGroup)

        this.spawnTime = options.backspinAssist ? this.visualTime.min : scaledTimeToEarliestTime(
            Math.min(
                this.visualTime.min,
                this.visualTime.max
            ),
            this.import.timescaleGroup
        )

        if (this.shouldScheduleSFX) this.scheduleSFX()

        new Rect({ l: this.import.lane === -3 ? -30 : this.import.lane * 2.1 - 2.1 * options.judgmentWidth, r: this.import.lane === 3 ? 30 : this.import.lane * 2.1 + 2.1 * options.judgmentWidth, b: 5, t: -5 }).transform(skin.transform).copyTo(this.hitbox)
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
        this.sfx.perfect.exists ? this.sfx.perfect.schedule(this.targetTime, 0.02) : this.sfx.fallback.perfect.schedule(this.targetTime, 0.02)
    }

    playSFX() {
        if (!this.shouldPlaySFX) return

        switch (this.result.judgment) {
            case Judgment.Perfect:
                this.sfx.perfect.exists ? this.sfx.perfect.play(0.02) : this.sfx.fallback.perfect.play(0.02)
                break
            case Judgment.Great:
                this.sfx.great.exists ? this.sfx.great.play(0.02) : this.sfx.fallback.great.play(0.02)
                break
            case Judgment.Good:
                this.sfx.good.exists ? this.sfx.good.play(0.02) : this.sfx.fallback.good.play(0.02)
                break
        }
    }

    updateParallel() {
        if (time.now > this.inputTime.max) this.despawn = true
        if (this.despawn) return

        // debug.log(this.import.beat)

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)
        if (scaledTime < this.visualTime.min + ((1 - options.laneLength) * note.duration)) return

        this.y = approach(this.visualTime.min, this.visualTime.max, scaledTime)

        this.drawNote()
    }

    updateSequentialOrder = 0
    updateSequential() {
        if (time.now >= this.inputTime.min && !this.despawn) inputNoteIndexes.add(this.info.index)
    }
}

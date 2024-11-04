import { approach, perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { getBackspinTime, note } from '../note.js'
import { particle } from '../particle.js'
import { getZ, skin } from '../skin.js'
import { moveHold } from './HoldManager.js'
import { archetypes } from './index.js'
import { scaledTimeToEarliestTime, timeToScaledTime } from './utils.js'

export class HoldConnector extends Archetype {
    import = this.defineImport({
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
    })

    sprite = this.entityMemory({
        slide: SkinSpriteId,
        connector: SkinSpriteId
    })

    head = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number,

        l: Number,
        r: Number,
    })
    tail = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number,

        l: Number,
        r: Number,
    })

    visualTime = this.entityMemory({
        min: Number,
        hidden: Number,
    })

    spawnTime = this.entityMemory(Number)

    connector = this.entityMemory({
        z: Number,
    })

    sfxId = this.entityMemory(ScheduledLoopedEffectClipInstanceId)

    slide = this.entityMemory({
        t: Number,
        b: Number,
        z: Number,
    })

    bsTime = this.entityMemory(Number)

    preprocess() {
        this.head.time = bpmChanges.at(this.headImport.beat).time
        this.head.scaledTime = timeToScaledTime(this.head.time, this.headImport.timescaleGroup)

        this.tail.time = bpmChanges.at(this.tailImport.beat).time
        this.tail.scaledTime = timeToScaledTime(this.tail.time, this.tailImport.timescaleGroup)

        this.visualTime.min = (options.backspinAssist ? this.head.time : this.head.scaledTime) - note.duration

        this.bsTime = getBackspinTime(this.head.time, this.headImport.timescaleGroup)
    
        const spawnTime = this.visualTime.min

        this.spawnTime = options.backspinAssist ? this.visualTime.min : Math.min(
            scaledTimeToEarliestTime(spawnTime, this.headImport.timescaleGroup),
            scaledTimeToEarliestTime(spawnTime, this.tailImport.timescaleGroup)
        )

        if (this.shouldScheduleSFX) this.scheduleSFX()
    }

    spawnOrder(): number {
        return 1000 + this.spawnTime
    }

    shouldSpawn(): boolean {
        return time.now >= this.spawnTime
    }

    initialize() {
        const w = 0.7 * options.noteSize
        const h = note.radius

        this.head.lane = this.headImport.lane * 2.1
        this.head.l = this.head.lane - w
        this.head.r = this.head.lane + w

        this.tail.lane = this.tailImport.lane * 2.1
        this.tail.l = this.tail.lane - w
        this.tail.r = this.tail.lane + w

        this.sprite.connector = (this.headImport.lane === -3 || this.headImport.lane === 3) ? skin.sprites.stopConnector.id : skin.sprites.holdConnector.id
        this.sprite.slide = (this.headImport.lane === -3 || this.headImport.lane === 3) ? skin.sprites.stopHead.id : skin.sprites.holdHead.id

        this.connector.z = getZ(98/* layer.note.connector */, this.head.time, this.headImport.lane)

        this.slide.t = 1 - h
        this.slide.b = 1 + h
        this.slide.z = getZ(/* layer.note.slide */99, this.head.time, this.headImport.lane)
    }

    updateParallel() {
        if (
            (time.now > this.tail.time) ||
            (this.startInfo.state === EntityState.Despawned &&
                !this.startSharedMemory.activatedTouchId) ||
            this.endInfo.state === EntityState.Despawned
        ) {
            // debug.log(time.now)
            this.despawn = true
            return
        }

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)

        if (scaledTime < this.visualTime.min + (1 - options.laneLength) * note.duration) return

        this.renderConnector()

        if (scaledTime < (options.backspinAssist ? this.head.time : this.head.scaledTime)) return

        this.renderSlide()
        this.updateEffects()
    }

    get startInfo() {
        return entityInfos.get(this.import.headRef)
    }

    get startSharedMemory() {
        return archetypes.HoldStartNote.sharedMemory.get(this.import.headRef)
    }

    get endInfo() {
        return entityInfos.get(this.import.tailRef)
    }

    get headImport() {
        return archetypes.HoldStartNote.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.HoldEndNote.import.get(this.import.tailRef)
    }

    get shouldScheduleSFX() {
        return options.sfxEnabled && effect.clips.longLoop.exists && options.autoSfx
    }

    get shouldUpdateCircularEffect() {
        return options.noteEffectEnabled && particle.effects.holdCircular.exists
    }

    get shouldUpdateLinearEffect() {
        return options.noteEffectEnabled && particle.effects.holdLinear.exists
    }

    scheduleSFX() {
        this.sfxId = effect.clips.longLoop.scheduleLoop(this.head.time)
        effect.clips.scheduleStopLoop(this.sfxId, this.tail.time)
    }

    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)

        const hiddenDuration = /* options.hidden > 0 ? note.duration * options.hidden : */ 0

        const visibleTime = {
            min: Math.max(options.backspinAssist ? this.head.time : time.now > this.head.time ? scaledTime : this.head.scaledTime, scaledTime + hiddenDuration),
            max: Math.min(options.backspinAssist ? this.tail.time : this.tail.scaledTime, scaledTime + note.duration * options.laneLength),
        }

        const l = {
            min: this.getL(visibleTime.min),
            max: this.getL(visibleTime.max),
        }

        const r = {
            min: this.getR(visibleTime.min),
            max: this.getR(visibleTime.max),
        }

        const y = {
            min: approach(visibleTime.min - note.duration, visibleTime.min, scaledTime),
            max: approach(visibleTime.max - note.duration, visibleTime.max, scaledTime),
        }

        const layout = {
            x1: l.min * y.min,
            x2: l.max * y.max,
            x3: r.max * y.max,
            x4: r.min * y.min,
            y1: y.min,
            y2: y.max,
            y3: y.max,
            y4: y.min,
        }

        skin.sprites.draw(this.sprite.connector, layout, this.connector.z, options.connectorAlpha)
        if (time.now < this.bsTime) skin.sprites.shadow.draw(layout, this.connector.z + 1, (1 - options.backspinBrightness) * options.connectorAlpha)
    }

    renderSlide() {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)
        skin.sprites.draw(
            this.sprite.slide,
            perspectiveLayout({
                l: this.getLane(scaledTime) - (1.05 * options.noteSize),
                r: this.getLane(scaledTime) + (1.05 * options.noteSize),
                b: this.slide.b,
                t: this.slide.t,
            }),
            this.slide.z,
            1,
        )
    }

    updateEffects() {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.headImport.timescaleGroup)
        moveHold(this.import.headRef, this.getLane(scaledTime))
    }

    getLane(time: number) {
        return Math.min(Math.max(this.head.lane, this.tail.lane), Math.max(Math.min(this.head.lane, this.tail.lane), Math.remap(options.backspinAssist ? this.head.time : this.head.scaledTime, options.backspinAssist ? this.tail.time : this.tail.scaledTime, this.head.lane, this.tail.lane, time)))
    }

    getL(time: number) {
        return Math.min(Math.max(this.head.l, this.tail.l), Math.max(Math.min(this.head.l, this.tail.l), Math.remap(options.backspinAssist ? this.head.time : this.head.scaledTime, options.backspinAssist ? this.tail.time : this.tail.scaledTime, this.head.l, this.tail.l, time)))
    }

    getR(time: number) {
        return Math.min(Math.max(this.head.r, this.tail.r), Math.max(Math.min(this.head.r, this.tail.r), Math.remap(options.backspinAssist ? this.head.time : this.head.scaledTime, options.backspinAssist ? this.tail.time : this.tail.scaledTime, this.head.r, this.tail.r, time)))
    }
}

import { approach, perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { getZ, skin } from '../skin.js'
import { moveHold } from './HoldManager.js'
import { archetypes } from './index.js'

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

    scheduleSFXTime = this.entityMemory(Number)

    visualTime = this.entityMemory({
        min: Number,
        hidden: Number,
    })

    spawnTime = this.entityMemory(Number)

    hasSFXScheduled = this.entityMemory(Boolean)

    connector = this.entityMemory({
        z: Number,
    })

    sfxId = this.entityMemory(ScheduledLoopedEffectClipInstanceId)

    slide = this.entityMemory({
        t: Number,
        b: Number,
        z: Number,
    })

    preprocess() {
        this.head.time = bpmChanges.at(this.headImport.beat).time
        this.head.scaledTime = /* ((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.head.time : */ timeScaleChanges.at(this.head.time).scaledTime

        this.scheduleSFXTime = ((this.headImport.lane === -3 || this.headImport.lane === 3 || options.backspinAssist) ? this.head.time : this.head.scaledTime) - 0.5

        this.visualTime.min = ((this.headImport.lane === -3 || this.headImport.lane === 3 || options.backspinAssist) ? this.head.time : this.head.scaledTime) - note.duration
        
        // debug.log(this.visualTime.min)
        // debug.log(note.duration)
        // this.tail.time = bpmChanges.at(this.tailImport.beat).time
        // this.tail.scaledTime = /* ((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.tail.time : */ timeScaleChanges.at(this.tail.time).scaledTime

        // debug.log(this.tail.scaledTime)

        this.spawnTime = Math.min(this.visualTime.min, this.scheduleSFXTime)
        // debug.log(this.spawnTime)
    }

    spawnOrder(): number {
        return 1000 + (((this.headImport.lane === -3 || this.headImport.lane === 3) && !options.backspinAssist) ? timeScaleChanges.at(this.spawnTime).scaledTime : this.spawnTime)
    }

    shouldSpawn(): boolean {
        return ((this.headImport.lane === -3 || this.headImport.lane === 3 || options.backspinAssist) ? time.now : time.scaled) >= this.spawnTime
    }

    initialize() {
        const w = 1.05
        const h = note.radius

        this.head.lane = this.headImport.lane * 2.1
        this.head.l = this.head.lane - w
        this.head.r = this.head.lane + w

        this.tail.time = bpmChanges.at(this.tailImport.beat).time
        this.tail.scaledTime = timeScaleChanges.at(this.tail.time).scaledTime

        this.tail.lane = this.tailImport.lane * 2.1
        this.tail.l = this.tail.lane - w
        this.tail.r = this.tail.lane + w

        this.sprite.connector = (this.headImport.lane === -3 || this.headImport.lane === 3) ? skin.sprites.stopConnector.id : skin.sprites.holdConnector.id
        this.sprite.slide = (this.headImport.lane === -3 || this.headImport.lane === 3) ? skin.sprites.stopHead.id : skin.sprites.holdHead.id
        // if (options.hidden > 0)
        //     this.visualTime.hidden = this.tail.time - note.duration * options.hidden

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
            this.despawn = true
            return
        }

        // if (this.shouldScheduleSFX && !this.hasSFXScheduled && (/* ((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : */ time.scaled) >= this.scheduleSFXTime) this.scheduleSFX()

        if ((((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled) < this.visualTime.min) return

        this.renderConnector()

        if ((((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled) < (((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.head.time : this.head.scaledTime)) return

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
        return options.sfxEnabled && effect.clips.longLoop.exists /* && options.autoSFX */
    }

    get shouldUpdateCircularEffect() {
        return options.noteEffectEnabled && particle.effects.holdCircular.exists
    }

    get shouldUpdateLinearEffect() {
        return options.noteEffectEnabled && particle.effects.holdLinear.exists
    }

    // scheduleSFX() {
    //     this.sfxId = effect.clips.hold.scheduleLoop(this.head.time)
    //     effect.clips.scheduleStopLoop(this.sfxId, this.tail.time)

    //     this.hasSFXScheduled = true
    // }

    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return

        const hiddenDuration = /* options.hidden > 0 ? note.duration * options.hidden : */ 0

        const visibleTime = {
            min: Math.max(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.head.time : this.head.scaledTime /* : timeScaleChanges.at(this.head.time).scaledTime */, (((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled) + hiddenDuration),
            max: Math.min(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.tail.time : this.tail.scaledTime /* : timeScaleChanges.at(this.tail.time).scaledTime */, (((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled) + note.duration),
        }

        // debug.log(visibleTime.min)
        // debug.log(visibleTime.max)

        const l = {
            min: this.getL(visibleTime.min),
            max: this.getL(visibleTime.max),
        }

        const r = {
            min: this.getR(visibleTime.min),
            max: this.getR(visibleTime.max),
        }

        const y = {
            min: approach(visibleTime.min - note.duration, visibleTime.min, (((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled)),
            max: approach(visibleTime.max - note.duration, visibleTime.max, (((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled)),
        }

        // debug.log(l.min)
        // debug.log(r.min)
        // debug.log(y.min)
        // debug.log(y.max)

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

        skin.sprites.draw(this.sprite.connector, layout, this.connector.z, /* options.connectorAlpha */1)
    }

    renderSlide() {
        skin.sprites.draw(
            this.sprite.slide,
            perspectiveLayout({
                l: this.getL(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled) - 0.25,
                r: this.getR(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled) + 0.25,
                b: this.slide.b,
                t: this.slide.t,
            }),
            this.slide.z,
            1,
        )
    }

    updateEffects() {
        moveHold(this.import.headRef, this.getLane((((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? time.now : time.scaled)))
    }

    getLane(time: number) {
        return Math.remap(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.head.time : this.head.scaledTime, ((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.tail.time : this.tail.scaledTime, this.head.lane, this.tail.lane, time)
    }

    getL(time: number) {
        return Math.remap(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.head.time : this.head.scaledTime, ((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.tail.time : this.tail.scaledTime, this.head.l, this.tail.l, time)
    }

    getR(time: number) {
        return Math.remap(((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.head.time : this.head.scaledTime, ((this.headImport.lane === -3 || this.headImport.lane === 3) || options.backspinAssist) ? this.tail.time : this.tail.scaledTime, this.head.r, this.tail.r, time)
    }
}

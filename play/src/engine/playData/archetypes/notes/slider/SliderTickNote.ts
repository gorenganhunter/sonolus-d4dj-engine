import { approach } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'
import { isUsed, markAsUsed } from "../../InputManager.js";
import { timeToScaledTime } from "../../utils.js";

export class SliderTickNote extends SliderNote {
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; fallback: { perfect: EffectClip; great: EffectClip; good: EffectClip } } = {
        perfect: effect.clips.sliderPerfect,
        great: effect.clips.sliderGreat,
        good: effect.clips.sliderGood,
        fallback: {
            perfect: effect.clips.perfect,
            great: effect.clips.great,
            good: effect.clips.good
        }
    }
    bucket: Bucket = buckets.sliderTickNote

    // hasInput = false
    used = this.entityMemory(Boolean)
    usedTime = this.entityMemory(Number)
    next = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number
    })

    preprocess() {
        super.preprocess()
        new Rect({ l: this.import.lane * 2.1 - 2.15, r: this.import.lane * 2.1 + 2.15, b: 5, t: -5 }).transform(skin.transform).copyTo(this.hitbox)
    }

    initialize() {
        super.initialize()
        this.used = false
        
        if(this.sliderImport.next) {
            this.next.time = bpmChanges.at(this.nextImport.beat).time
            this.next.scaledTime = options.backspinAssist ? this.next.time : timeToScaledTime(this.next.time, this.nextImport.timescaleGroup)
            this.next.lane = this.nextImport.lane * 24 / 100
        }
    }

    touch() {
        if (this.sliderImport.prev && this.prevInfo.state !== EntityState.Despawned) return
        if ((time.now < this.targetTime - this.windows.good.max) && ((slider.next.beat !== this.import.beat) && (slider.next.lane !== this.import.lane))) return
        if (time.now > this.targetTime + this.windows.good.max) return

        const hitbox = this.getHitbox()

        for (const touch of touches) {
            if (!touch.started) continue
            if (isUsed(touch)) continue
            if (!hitbox.contains(touch.position)) continue

            markAsUsed(touch)
            slider.touch = touch.id

            // const tch = touch.x / screen.h * 10.75 / options.width / (1 + note.radius * 4)
            // const sliderPos = (tch > 4.2) ? 4.2 : (tch < -4.2) ? -4.2 : tch
            // 
            // slider.position = sliderPos

            // debug.log(touch.id)

            // const tch = touch.x / screen.h * 10.75 / options.width / (1 + note.radius * 4)
            // const sliderPos = (tch > 4.2) ? 4.2 : (tch < -4.2) ? -4.2 : tch

            // slider.position = sliderPos
        }
    }

    updateSequential() {
        super.updateSequential()
        if (this.sliderImport.prev && this.prevInfo.state !== EntityState.Despawned) return
        if (time.now < this.targetTime - this.windows.good.max) return
        if (time.now > this.targetTime + this.windows.good.max) return this.incomplete(time.now)

        const hitbox = this.getHitbox()

        if (hitbox.contains(new Vec({ x: slider.position, y: 1 + note.radius * 4 }).transform(skin.transform))) {
            if (time.now < this.targetTime) {
                this.usedTime = time.now
                this.used = true
            } else {
                this.complete(this.targetTime)
            }
        } else if (this.used && time.now >= this.targetTime) this.complete(this.usedTime)
    }

    updateParallel() {
        super.updateParallel()

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)
        if (scaledTime < this.visualTime.min + (1 - options.laneLength) * note.duration) return

        if (this.sliderImport.next) this.renderConnector()
    }
    
    incomplete(hitTime: number) {
        super.incomplete(hitTime)

        slider.touch = 0
        slider.isUsed = false
        slider.next.lane = this.nextImport.lane
    }
    
    complete(hitTime: number) {
        if (this.sliderImport.next) {
            slider.next.beat = this.nextImport.beat
            slider.next.lane = this.nextImport.lane
            slider.next.timescaleGroup = this.nextImport.timescaleGroup
            slider.isUsed = true
        } else {
            slider.isUsed = false
        }

        this.result.judgment = input.judge(hitTime, this.targetTime, this.windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }

    // playEffect() {
    //     particle.effects.slider.spawn(this.notePosition, (0.1 * options.noteSize), false)
    // }

    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)

        const hiddenDuration = /* options.hidden > 0 ? note.duration * options.hidden : */ 0

        const visibleTime = {
            min: Math.max(this.visualTime.max, scaledTime + hiddenDuration),
            max: Math.min(this.next.scaledTime, scaledTime + note.duration * options.laneLength),
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

        skin.sprites.sliderConnector.draw(layout, this.z - 5, options.connectorAlpha)
        if (time.now < this.bsTime) skin.sprites.shadow.draw(layout, this.z - 4, (1 - options.backspinBrightness) * options.connectorAlpha)
    }

    getLane(time: number) {
        return Math.remap(this.visualTime.max, this.next.scaledTime, this.import.lane * 2.1, this.nextImport.lane * 2.1, time)
    }

    getL(time: number) {
        return Math.remap(this.visualTime.max, this.next.scaledTime, this.import.lane * 2.1 - (0.125 * options.noteSize), this.nextImport.lane * 2.1 - (0.125 * options.noteSize), time)
    }

    getR(time: number) {
        return Math.remap(this.visualTime.max, this.next.scaledTime, this.import.lane * 2.1 + (0.125 * options.noteSize), this.nextImport.lane * 2.1 + (0.125 * options.noteSize), time)
    }
}

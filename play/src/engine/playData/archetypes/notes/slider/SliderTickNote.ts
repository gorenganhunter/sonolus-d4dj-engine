import { approach } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { sliderWindows, windows } from "../../../windows.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'

export class SliderTickNote extends SliderNote {
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; } = {
        perfect: effect.clips.sliderPerfect,
        great: effect.clips.sliderGreat,
        good: effect.clips.sliderGood
    }
    bucket: Bucket = buckets.sliderTickNote

    // hasInput = false
    used = this.entityMemory(Boolean)
    next = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number
    })

    initialize() {
        super.initialize()
        new Rect({ l: this.import.lane * 2.1 - 2.11, r: this.import.lane * 2.1 + 2.11, b: 1 + (sliderWindows.good.max / note.duration), t: 1 - (sliderWindows.good.max / note.duration) }).transform(skin.transform).copyTo(this.hitbox)
        this.used = false
        
        if(this.sliderImport.next) {
            this.next.time = bpmChanges.at(this.nextImport.beat).time
            this.next.scaledTime = timeScaleChanges.at(this.next.time).scaledTime
            this.next.lane = this.nextImport.lane * 24 / 100
        }
    }

    touch() {}

    updateSequential() {
        super.updateSequential()
        if(this.sliderImport.next) this.renderConnector()
        if (time.now < this.targetTime - sliderWindows.good.max) return
        if (this.hitbox.contains(new Vec({ x: slider.position, y: 1 }).transform(skin.transform))) {

            if (time.now < this.targetTime) {
                this.used = true
            } else {
                this.complete(this.targetTime)
            }
        } else if (this.used) {
            this.complete(time.now)
        } else if (time.now > this.targetTime + sliderWindows.good.max) this.incomplete(time.now)
    }
    
    incomplete(hitTime: number) {
        super.incomplete(hitTime)

        slider.isUsed = false
        slider.next.lane = this.nextImport.lane
    }
    
    complete(hitTime: number) {
        if (this.sliderImport.next) {
            slider.next.beat = this.nextImport.beat
            slider.next.lane = this.nextImport.lane
            slider.isUsed = true
        } else {
            slider.isUsed = false
        }

        this.result.judgment = input.judge(hitTime, this.targetTime, windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }

    // playEffect() {
    //     particle.effects.slider.spawn(this.notePosition, 0.2, false)
    // }

    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return

        const hiddenDuration = /* options.hidden > 0 ? note.duration * options.hidden : */ 0

        const visibleTime = {
            min: Math.max(/* (this.headImport.lane === (3 || -3)) ? */ options.backspinAssist ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime /* : timeScaleChanges.at(this.head.time).scaledTime */, (options.backspinAssist ? time.now : time.scaled) + hiddenDuration),
            max: Math.min(/* (this.headImport.lane === (3 || -3)) ? */ options.backspinAssist ? this.next.time : this.next.scaledTime /* : timeScaleChanges.at(this.tail.time).scaledTime */, (options.backspinAssist ? time.now : time.scaled) + note.duration),
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
            min: approach(visibleTime.min - note.duration, visibleTime.min, options.backspinAssist ? time.now : time.scaled),
            max: approach(visibleTime.max - note.duration, visibleTime.max, options.backspinAssist ? time.now : time.scaled),
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

        skin.sprites.sliderConnector.draw(layout, 104, options.connectorAlpha)
    }

    getLane(time: number) {
        return Math.remap(options.backspinAssist ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime, options.backspinAssist ? this.next.time : this.next.scaledTime, this.import.lane * 2.1, this.nextImport.lane * 2.1, time)
    }

    getL(time: number) {
        return Math.remap(options.backspinAssist ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime, options.backspinAssist ? this.next.time : this.next.scaledTime, this.import.lane * 2.1 - 0.2, this.nextImport.lane * 2.1 - 0.2, time)
    }

    getR(time: number) {
        return Math.remap(options.backspinAssist ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime, options.backspinAssist ? this.next.time : this.next.scaledTime, this.import.lane * 2.1 + 0.2, this.nextImport.lane * 2.1 + 0.2, time)
    }
}

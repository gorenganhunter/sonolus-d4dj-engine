import { approach } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'
import { archetypes } from "../../index.js";
import { timeToScaledTime } from "../../timeScale.js";
import { scaledScreen } from "../../../scaledScreen.js";

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
    next = this.entityMemory({
        time: Number,
        scaledTime: Number,
        lane: Number
    })

    initialize() {
        super.initialize()
        // new Rect({ l: this.import.lane * 2.1 - 2.11, r: this.import.lane * 2.1 + 2.11, b: 1 + (sliderWindows.good.max / note.duration), t: 1 - (sliderWindows.good.max / note.duration) }).transform(skin.transform).copyTo(this.hitbox)
        // this.used = false
        
        if(this.sliderImport.next) {
            this.next.time = bpmChanges.at(this.nextImport.beat).time
            this.next.scaledTime = options.backspinAssist ? this.next.time : timeToScaledTime(this.next.time, this.nextImport.timescaleGroup)
            this.next.lane = this.nextImport.lane * 24 / 100
        }
    }

    touch() {}

    updateParallel() {
        super.updateParallel()

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)
        if (scaledTime < this.visualTime.min + (1 - options.laneLength) * note.duration) return

        if(this.sliderImport.next) this.renderConnector()
        // if (time.now < this.targetTime/*  - sliderWindows.good.max */) return
        // if (this.hitbox.contains(new Vec({ x: slider.position, y: 1 }).transform(skin.transform))) {

            // if (time.now < this.targetTime) {
        // if (this.used) return

        // this.used = true
        // this.complete()
            // } else {
            //     this.complete(this.targetTime)
            // }
        // } else if (this.used) {
        //     this.complete(time.now)
        // } else if (time.now > this.targetTime + sliderWindows.good.max) this.incomplete(time.now)
    }
    
    // incomplete(hitTime: number) {
    //     super.incomplete(hitTime)

    //     slider.isUsed = false
    //     slider.next.lane = this.nextImport.lane
    // }
    // 
    // complete(/*hitTime: number*/) {
    //     if (this.sliderImport.next) {
    //         slider.next.beat = this.nextImport.beat
    //         slider.next.lane = this.nextImport.lane
    //         slider.next.timescaleGroup = this.nextImport.timescaleGroup
    //         slider.isUsed = true
    //     } else {
    //         slider.isUsed = false
    //     }

        // archetypes.Honoka.spawn({ time: time.now })

        // this.result.judgment = input.judge(hitTime, this.targetTime, windows)
        // this.result.accuracy = hitTime - this.targetTime

        // this.result.bucket.index = this.bucket.index
        // this.result.bucket.value = this.result.accuracy * 1000

        // if (options.sfxEnabled) switch (this.result.judgment) {
        //     case Judgment.Perfect:
        //         this.sfx.perfect.play(0.02)
        //         break
        //     case Judgment.Great:
        //         this.sfx.great.play(0.02)
        //         break
        //     case Judgment.Good:
        //         this.sfx.good.play(0.02)
        //         break
        // }

        // this.playEffect()

        // this.despawn = true
    // }

    // playEffect() {
    //     particle.effects.slider.spawn(this.notePosition, 0.2, false)
    // }

    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return

        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)
        const nextScaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.nextImport.timescaleGroup)
        const hiddenDuration = /* options.hidden > 0 ? note.duration * options.hidden : */ 0

        const visibleTime = {
            min: this.visualTime.max,
            max: Math.min(this.next.scaledTime, nextScaledTime + note.duration * options.laneLength),
        }
        
        // const l = {
        //     min: this.getL(visibleTime.min),
        //     max: this.getL(visibleTime.max),
        // }

        // const r = {
        //     min: this.getR(visibleTime.min),
        //     max: this.getR(visibleTime.max),
        // }

        const x = {
            min: this.import.lane * 2.1,
            max: this.getLane(visibleTime.max),
        }

        const y = {
            min: approach(visibleTime.min - note.duration, visibleTime.min, scaledTime),
            max: approach(visibleTime.max - note.duration, visibleTime.max, nextScaledTime),
        }
        
        const thickness = 0.25 * options.noteSize
        const width = x.max - x.min
        const height = (y.max - y.min) / scaledScreen.wToH
        const length = Math.sqrt(width * width + height * height)
        // debug.log(thickness)
        // debug.log(width)
        // debug.log(height)
        // debug.log(length)

        const xS = (thickness * height / length) / 2
        const yS = ((thickness * width / length) / 2) * scaledScreen.wToH
// debug.log(scaledScreen.wToH)
//         debug.log(xS)
//         debug.log(yS)
        const layout = {
            x1: (x.min - xS)/*  * (y.min + yS) */,
            x2: (x.max - xS)/*  * (y.max + yS) */,
            x3: (x.max + xS)/*  * (y.max - yS) */,
            x4: (x.min + xS)/*  * (y.min - yS) */,
            y1: (y.min + yS * y.min),
            y2: (y.max + yS * y.max),
            y3: (y.max - yS * y.max),
            y4: (y.min - yS * y.min),
        }

        layout.x1 *= layout.y1
        layout.x2 *= layout.y2
        layout.x3 *= layout.y3
        layout.x4 *= layout.y4

        skin.sprites.sliderConnector.draw(layout, this.z - 5, options.connectorAlpha)
        if (time.now < this.bsTime) skin.sprites.shadow.draw(layout, this.z - 4, (1 - options.backspinBrightness) * options.connectorAlpha)
    }

    getLane(time: number) {
        return Math.remap(this.visualTime.max, this.next.scaledTime, this.import.lane * 2.1, this.nextImport.lane * 2.1, time)
    }

    // getL(time: number) {
    //     return Math.remap(this.visualTime.max, this.next.scaledTime, this.import.lane * 2.1 - (0.125 * options.noteSize), this.nextImport.lane * 2.1 - (0.125 * options.noteSize), time)
    // }

    // getR(time: number) {
    //     return Math.remap(this.visualTime.max, this.next.scaledTime, this.import.lane * 2.1 + (0.125 * options.noteSize), this.nextImport.lane * 2.1 + (0.125 * options.noteSize), time)
    // }
}

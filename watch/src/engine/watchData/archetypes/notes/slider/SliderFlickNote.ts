import { EffectClip } from "@sonolus/sonolus.js-compiler/play";
import { leftRotated, perspectiveLayout, rightRotated } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { getZ, skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
// import { isUsed, markAsUsed } from "../../InputManager.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'

export class SliderFlickNote extends SliderNote {
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; fallback: { perfect: EffectClip; great: EffectClip; good: EffectClip } } = {
        perfect: effect.clips.sliderFlickPerfect,
        great: effect.clips.sliderFlickPerfect,
        good: effect.clips.sliderFlickPerfect,
        fallback: {
            perfect: effect.clips.perfectAlt,
            great: effect.clips.greatAlt,
            good: effect.clips.goodAlt
        }
    }
    bucket = buckets.sliderFlickNote

    arrow = this.entityMemory({
        layout: Quad,
        z: Number
    })

    activatedTouch = this.entityMemory({
        id: Number,
        right: Vec,
        left: Vec
    })

    used = this.entityMemory(Boolean)

    preprocess() {
        if (options.mirror) this.sliderImport.direction *= -1
        
        super.preprocess()
    }

    initialize() {
        super.initialize()

        // const lane = this.import.lane
        // const direction = this.sliderImport.direction
        
        // const l = (lane + (direction < 0 ? direction : 0)) * 2.1 - 1.05
        // const r = (lane + (direction > 0 ? direction : 0)) * 2.1 + 1.05

        // new Rect({ l, r, b: 2, t: -1 }).transform(skin.transform).copyTo(this.hitbox)
        this.arrow.z = getZ(103, this.targetTime, this.import.lane)
    }

    drawNote() {
        super.drawNote()
        
        const b = 1 + note.radius * 2
        const t = 1 - note.radius * 2

        if (this.sliderImport.direction > 0) for (let i = 0.7; i <= this.sliderImport.direction; i += 0.5) {
            const lane = (this.import.lane + i) * 2.1
            const layout = perspectiveLayout({
                r: lane - 1.05,
                l: lane + 1.05,
                b,
                t
            }).mul(this.y)
            skin.sprites.sliderArrow.draw(layout, this.z - 2, 1)

            const n = Math.floor((this.sliderImport.direction - 0.7) / 0.5)
            const x = (i - 0.7) / 0.5
            let a = ((time.now - (x / n)) % (0.25 * n)) * 4 / n
            a = Math.abs(a - Math.round(a))

            skin.sprites.shadowSliderArrow.draw(layout, this.z - 1, a)

            if (time.now < this.bsTime) skin.sprites.shadowSliderArrow.draw(layout, this.z - 1, 1 - options.backspinBrightness)
        }
        else for (let i = -0.7; i >= this.sliderImport.direction; i -= 0.5) {
            const lane = (this.import.lane + i) * 2.1
            const layout = perspectiveLayout({
                l: lane - 1.05,
                r: lane + 1.05,
                b,
                t
            }).mul(this.y)
            skin.sprites.sliderArrow.draw(layout, this.z - 2, 1)

            const n = Math.floor((this.sliderImport.direction + 0.7) / -0.5)
            const x = (i + 0.7) / -0.5
            let a = ((time.now - (x / n)) % (0.25 * n)) * 4 / n
            a = Math.abs(a - Math.round(a))

            skin.sprites.shadowSliderArrow.draw(layout, this.z - 1, a)

            if (time.now < this.bsTime) skin.sprites.shadowSliderArrow.draw(layout, this.z - 1, 1 - options.backspinBrightness)
        }
    }
    
    // touch() {
    //     if(time.now < this.inputTime.min) return

    //     if(this.activatedTouch.id) {
    //         for (const touch of touches) {
    //             if(touch.id !== this.activatedTouch.id) continue
    //             if(time.now > this.inputTime.max) return this.incomplete(touch.t)

    //             slider.position = touch.position.x

    //             const p = (touch.position.x - (this.sliderImport.direction > 0 ? this.activatedTouch.left.x : this.activatedTouch.right.x)) * (this.sliderImport.direction > 0 ? 1 : -1)

    //             if(p > 0) this.complete(time.now)
    //             else if(touch.ended) this.incomplete(touch.t)
    //             else if (this.hitbox.contains(touch.position)) {
    //                 if (touch.position.x < this.activatedTouch.left.x) touch.position.copyTo(this.activatedTouch.left)
    //                 if (touch.position.x > this.activatedTouch.right.x) touch.position.copyTo(this.activatedTouch.right)
    //             }

    //             return
    //         }
    //     } else {
    //         for (const touch of touches) {
    //             if(time.now > this.inputTime.max) return this.incomplete(touch.t)
    //             if(slider.touch !== touch.id && isUsed(touch)) continue
    //             if(!this.hitbox.contains(touch.position)) continue

    //             markAsUsed(touch)
    //             slider.isUsed = true
    //             slider.touch = touch.id

    //             slider.position = touch.position.x

    //             this.activatedTouch.id = touch.id
    //             touch.position.copyTo(this.activatedTouch.right)
    //             touch.position.copyTo(this.activatedTouch.left)
    //             
    //             return
    //         }
    //     }
    // }

    // playEffect() {
    //     if (options.noteEffectEnabled) particle.effects.scratch.spawn(this.notePosition, 0.2, false)
    //     // particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    // }

    // updateSequential() {
    //     super.updateSequential()
        // if (time.now < this.targetTime/*  - sliderWindows.good.max */) return
        // if (this.hitbox.contains(new Vec({ x: slider.position, y: 1 }).transform(skin.transform))) {

            // if (time.now < this.targetTime) {
        // if (this.used) return

        // this.used = true
        // this.complete()
    // }

    // incomplete(hitTime: number) {
    //     super.incomplete(hitTime)
    //     
    //     slider.isUsed = false
    //     slider.next.lane = this.import.lane + this.sliderImport.direction
    // }

    // complete(/*hitTime: number*/) {
    //     if (this.sliderImport.next) {
    //         slider.next.beat = this.nextImport.beat
    //         slider.next.lane = this.nextImport.lane
    //         slider.isUsed = true
    //     } else {
    //         slider.isUsed = false
    //     }
    // }
    // complete(hitTime: number) {
    //     this.result.judgment = input.judge(hitTime, this.targetTime, sliderWindows)
    //     this.result.accuracy = hitTime - this.targetTime

    //     this.result.bucket.index = this.bucket.index
    //     this.result.bucket.value = this.result.accuracy * 1000

    //     this.playEffect()
    //     
    //     if (options.sfxEnabled) switch (this.result.judgment) {
    //         case Judgment.Perfect:
    //             this.sfx.perfect.play(0.02)
    //             break
    //         case Judgment.Great:
    //             this.sfx.great.play(0.02)
    //             break
    //         case Judgment.Good:
    //             this.sfx.good.play(0.02)
    //             break
    //     }

    //     this.despawn = true
    //     slider.isUsed = false
    //     slider.next.lane = this.import.lane + this.sliderImport.direction
    // }
}

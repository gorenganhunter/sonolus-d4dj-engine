import { EffectClip } from "@sonolus/sonolus.js-compiler/play";
import { leftRotated, perspectiveLayout, rightRotated } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { getZ, skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'
import { claim, isClaimed, startClaim } from "../../Slider.js"

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

    preprocess() {
        super.preprocess()

        if (options.mirror) this.sliderImport.direction *= -1
    }

    initialize() {
        super.initialize()

        const lane = this.import.lane
        const direction = this.sliderImport.direction
        
        const l = (lane + (direction < 0 ? direction : 0)) * 2.1 - 1.05
        const r = (lane + (direction > 0 ? direction : 0)) * 2.1 + 1.05

        new Rect({ l, r, b: options.judgmentMode ? (1.1 + note.radius * 4) : 2, t: options.judgmentMode ? (0.9 + note.radius * 4) : -1 }).transform(skin.transform).copyTo(this.hitbox)
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
    
    touch() {
        if(time.now < this.inputTime.min) return

        if(this.activatedTouch.id) {
            for (const touch of touches) {
                if(time.now > this.inputTime.max) return this.incomplete(touch.t)
                if(touch.id !== this.activatedTouch.id) continue
                if(isClaimed(touch)) return

                // slider.position = touch.position.x

                const p = (touch.position.x - (this.sliderImport.direction > 0 ? this.activatedTouch.left.x : this.activatedTouch.right.x)) * (this.sliderImport.direction > 0 ? 1 : -1)
//debug.log(p)
                if(p > 0.2) this.complete(touch)
                else if(touch.ended) this.incomplete(touch.t)
                else if (this.hitbox.contains(touch.position)) {
                    if (touch.position.x < this.activatedTouch.left.x) touch.position.copyTo(this.activatedTouch.left)
                    if (touch.position.x > this.activatedTouch.right.x) touch.position.copyTo(this.activatedTouch.right)
                }

                return
            }
        } else {
            for (const touch of touches) {
                if(time.now > this.inputTime.max) return this.incomplete(touch.t)
                if(slider.touch !== touch.id && isUsed(touch)) continue
                if(!this.hitbox.contains(touch.position)) continue
                if(isClaimed(touch)) continue
//debug.log(touch.id)
                markAsUsed(touch)
                startClaim(touch)
                
                slider.isUsed = false
                slider.touch = touch.id

                // slider.position = touch.position.x

                this.activatedTouch.id = touch.id
                touch.position.copyTo(this.activatedTouch.right)
                touch.position.copyTo(this.activatedTouch.left)
                
                return
            }
        }
    }

    playEffect() {
        super.playEffect()
        if (!options.noteEffectEnabled) return

        const layout = perspectiveLayout({
            t: 1.5,
            b: 0,
            l: this.import.lane * 2.1,
            r: (this.import.lane + this.sliderImport.direction) * 2.1
        })

        particle.effects.sliderFlick.spawn(layout, 0.2, false)
    }

    updateSequential() {
        super.updateSequential()
        if (time.now > this.inputTime.max) this.incomplete(time.now)
    }
    
    updateParallel() {
        super.updateParallel()

        if (!this.result.judgment || time.now <= this.targetTime + this.windows.perfect.min) return
// // debug.log(this.result.judgment)

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }

    incomplete(hitTime: number) {
        super.incomplete(hitTime)
        // debug.log(hitTime - this.targetTime)
        slider.isUsed = false
        slider.next.lane = this.import.lane + this.sliderImport.direction
    }

    complete(touch: Touch) {
        const t = Math.max(Math.min(touch.t, this.targetTime + this.windows.perfect.max / 2), this.targetTime + this.windows.perfect.min / 2)
        this.result.judgment = input.judge(t, this.targetTime, this.windows)
        this.result.accuracy = t - this.targetTime

        // debug.log(this.result.accuracy)

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        // this.playSFX()
        // this.playEffect()

        claim(touch)
        
        slider.isUsed = false
        slider.next.lane = this.import.lane + this.sliderImport.direction
    }
}

import { EffectClip } from "@sonolus/sonolus.js-compiler/play";
import { leftRotated, perspectiveLayout, rightRotated } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { getZ, skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { sliderWindows } from "../../../windows.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'

export class SliderFlickNote extends SliderNote {
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; } = {
        perfect: effect.clips.sliderFlickPerfect,
        great: effect.clips.sliderFlickPerfect,
        good: effect.clips.sliderFlickPerfect
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

    initialize() {
        super.initialize()

        const lane = this.import.lane
        const direction = this.sliderImport.direction
        
        const l = (lane + (direction < 0 ? direction : 0)) * 2.1 - 1.05
        const r = (lane + (direction > 0 ? direction : 0)) * 2.1 + 1.05

        new Rect({ l, r, b: 2, t: -1 }).transform(skin.transform).copyTo(this.hitbox)
        this.arrow.z = getZ(103, this.targetTime, this.import.lane)
    }

    drawNote() {
        super.drawNote()
        
        const b = 1 + note.radius
        const t = 1 - note.radius

        if (this.sliderImport.direction > 0) for (let i = 1; i <= this.sliderImport.direction; i++) {
            const lane = (this.import.lane + i) * 2.1
            const layout = {
                r: lane - 1.05,
                l: lane + 1.05,
                b,
                t
            }
            skin.sprites.sliderArrow.draw(perspectiveLayout(layout).mul(this.y), this.arrow.z, 1)
        }
        else for (let i = -1; i >= this.sliderImport.direction; i--) {
            const lane = (this.import.lane + i) * 2.1
            const layout = {
                l: lane - 1.05,
                r: lane + 1.05,
                b,
                t
            }
            skin.sprites.sliderArrow.draw(perspectiveLayout(layout).mul(this.y), this.arrow.z, 1)
        }
    }
    
    touch() {
        if(time.now < this.inputTime.min) return

        if(this.activatedTouch.id) {
            for (const touch of touches) {
                if(touch.id !== this.activatedTouch.id) continue
                if(time.now > this.inputTime.max) return this.incomplete(touch.t)

                slider.position = touch.position.x

                const p = (touch.position.x - (this.sliderImport.direction > 0 ? this.activatedTouch.left.x : this.activatedTouch.right.x)) * (this.sliderImport.direction > 0 ? 1 : -1)

                if(p > 0) this.complete(time.now)
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

                markAsUsed(touch)
                slider.isUsed = true
                slider.touch = touch.id

                slider.position = touch.position.x

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

    incomplete(hitTime: number) {
        super.incomplete(hitTime)
        
        slider.isUsed = false
        slider.next.lane = this.import.lane + this.sliderImport.direction
    }

    complete(hitTime: number) {
        this.result.judgment = input.judge(hitTime, this.targetTime, sliderWindows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        this.playEffect()
        
        this.despawn = true
        slider.isUsed = false
        slider.next.lane = this.import.lane + this.sliderImport.direction
    }
}

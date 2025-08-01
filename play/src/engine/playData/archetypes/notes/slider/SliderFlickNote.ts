import { EffectClip } from "@sonolus/sonolus.js-compiler/play";
import { leftRotated, perspectiveLayout, rightRotated } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { getZ, skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { isUsed, markAsUsed, markAsUsedId } from "../../InputManager.js";
import { SliderNote } from "./SliderNote.js";
import { options } from '../../../../configuration/options.js'
import { flickClaimStart, flickGetClaimedStart, noEmptyTap } from "../../Slider.js";
import { archetypes } from "../../index.js";

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

    touchOrder = 2

    arrow = this.entityMemory({
        layout: Quad,
        z: Number
    })

    played = this.entityMemory(Boolean)

    preprocess() {
        super.preprocess()

        if (options.mirror) this.sliderImport.direction *= -1

        const lane = this.import.lane
        const direction = this.sliderImport.direction

        const l = (lane + (direction < 0 ? direction : 0)) * 2.1 - 1.05
        const r = (lane + (direction > 0 ? direction : 0)) * 2.1 + 1.05

        new Rect({ l, r, b: 5, t: -5 }).transform(skin.transform).copyTo(this.hitbox)

        this.played = false
    }

    initialize() {
        super.initialize()

        this.arrow.z = getZ(103, this.targetTime, this.import.lane)
    }

    drawNote() {
        super.drawNote()

        const b = 1 + note.radius * 2
        const t = 1 - note.radius * 2

        const n = this.sliderImport.direction * 2

        if (this.sliderImport.direction > 0) for (let i = 0; i < n; i++) {
            const j = 0.6 + 0.41 * i
            const lane = (this.import.lane + j) * 2.1
            const layout = perspectiveLayout({
                r: lane - 0.8,
                l: lane + 0.8,
                b,
                t
            }).mul(this.y)
            skin.sprites.sliderArrow.draw(layout, this.z - 3, 1)

            let a = ((time.now - (i / n)) % 1)
            a = Math.abs(a - Math.round(a))

            skin.sprites.sliderArrowGlow.draw(layout, this.z - 2, a * 2)

            if (time.now < this.bsTime) skin.sprites.shadowSliderArrow.draw(layout, this.z - 1, 1 - options.backspinBrightness)
        }
        else for (let i = 0; i > n; i--) {
            const j = -0.6 + 0.41 * i
            const lane = (this.import.lane + j) * 2.1
            const layout = perspectiveLayout({
                l: lane - 0.8,
                r: lane + 0.8,
                b,
                t
            }).mul(this.y)
            skin.sprites.sliderArrow.draw(layout, this.z - 3, 1)

            let a = ((time.now - (i / n)) % 1)
            a = Math.abs(a - Math.round(a))

            skin.sprites.sliderArrowGlow.draw(layout, this.z - 2, a * 2)

            if (time.now < this.bsTime) skin.sprites.shadowSliderArrow.draw(layout, this.z - 1, 1 - options.backspinBrightness)
        }
    }

    touch() {
        if (this.sliderImport.prev && this.prevInfo.state !== EntityState.Despawned) return
        if (this.played) return
        if (time.now < this.inputTime.min) return
        for (const touch of touches) {
            // if(time.now < this.inputTime.min) return
            // if(time.now > this.inputTime.max) return this.incomplete(time.now)
            if (!touch.started) continue
            if (isUsed(touch)) continue
            if (!this.hitbox.contains(touch.position)) continue
            noEmptyTap.add(touch.id)
        }
        let index = flickGetClaimedStart(this.info.index)
        if (index === -1) return
        markAsUsedId(index)
        slider.isUsed = false
        streams.set(0, time.now - 0.0001, slider.position)
        streams.set(0, time.now, this.import.lane * 2.1)
        slider.lastSavedPosition = this.import.lane * 2.1
        slider.touch = index
        this.played = true
        // debug.log(index)
        //         if(this.activatedTouch.id) {
        //             for (const touch of touches) {
        //                 if(time.now > this.inputTime.max) return this.incomplete(time.now)
        //                 if(touch.id !== this.activatedTouch.id) continue
        //                 // if(isClaimed(touch)) return

        //                 // slider.position = touch.position.x

        //                 const p = (touch.position.x - (this.sliderImport.direction > 0 ? this.activatedTouch.left.x : this.activatedTouch.right.x)) * (this.sliderImport.direction > 0 ? 1 : -1)
        // //debug.log(p)
        //                 if(p > 0.2) this.complete(touch)
        //                 else if(touch.ended) this.incomplete(time.now)
        //                 else if (this.hitbox.contains(touch.position)) {
        //                     if (touch.position.x < this.activatedTouch.left.x) touch.position.copyTo(this.activatedTouch.left)
        //                     if (touch.position.x > this.activatedTouch.right.x) touch.position.copyTo(this.activatedTouch.right)
        //                 }

        //                 return
        //             }
        //         } else {
        //             for (const touch of touches) {
        //                 if(time.now > this.inputTime.max) return this.incomplete(time.now)
        //                 if(slider.touch !== touch.id && isUsed(touch)) continue
        //                 if(!this.hitbox.contains(touch.position)) continue
        //                 // if(isClaimed(touch)) continue
        // //debug.log(touch.id)
        //                 markAsUsed(touch)
        //                 // startClaim(touch)
        //                 
        //                 slider.isUsed = false
        //                 // slider.touch = touch.id

        //                 // slider.position = touch.position.x

        //                 this.activatedTouch.id = touch.id
        //                 touch.position.copyTo(this.activatedTouch.right)
        //                 touch.position.copyTo(this.activatedTouch.left)
        //                 
        //                 return
        //            }
        //         }
    }

    playEffect() {
        super.playEffect()
        if (!options.noteEffectEnabled) return

        archetypes.SliderFlickParticle.spawn({ startLane: this.import.lane, start: time.now, direction: this.sliderImport.direction })

        // const layout = perspectiveLayout({
        //     t: 1.5,
        //     b: 0,
        //     l: this.import.lane * 2.1,
        //     r: (this.import.lane + this.sliderImport.direction) * 2.1
        // })

        // particle.effects.sliderFlick.spawn(layout, 0.2, false)
    }

    updateSequential() {
        // super.updateSequential()
        if (this.sliderImport.prev && this.prevInfo.state !== EntityState.Despawned) return
        if (this.played) {
            if (time.now < this.targetTime) return
            this.complete(time.now)
            return
        }
        if (time.now < this.inputTime.min) return
        if (time.now > this.inputTime.max) this.incomplete(time.now)
        flickClaimStart(this.info.index)
    }

    updateParallel() {
        super.updateParallel()

        if (!this.result.judgment || time.now <= this.targetTime /* + this.windows.perfect.min*/) return
        // // debug.log(this.result.judgment)

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }

    incomplete(hitTime: number) {
        super.incomplete(hitTime)
        // debug.log(hitTime - this.targetTime)
        streams.set(0, time.now - 0.0001, slider.position)
        streams.set(0, time.now, slider.next.lane * 2.1)
        slider.lastSavedPosition = slider.next.lane * 2.1
        slider.touch = 0
        slider.isUsed = false
        slider.next.lane = this.import.lane + this.sliderImport.direction
    }

    complete(hitTime: number) {
        const t = Math.max(Math.min(hitTime, this.targetTime + this.windows.perfect.max / 2), this.targetTime + this.windows.perfect.min / 2)
        this.result.judgment = input.judge(t, this.targetTime, this.windows)
        this.result.accuracy = t - this.targetTime

        // debug.log(this.result.accuracy)

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        // this.playSFX()
        // this.playEffect()

        // claim(touch)

        slider.isUsed = false
        slider.next.lane = this.import.lane + this.sliderImport.direction
    }
}

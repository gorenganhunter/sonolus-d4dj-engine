import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { approach, perspectiveAdjust, perspectiveLayout } from '../../../../../../../shared/src/engine/data/utils.js'
import { note } from "../../../note.js";
import { circularEffectLayout, linearEffectLayout, particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { isUsed, markAsUsed, markAsUsedId } from "../../InputManager.js";
import { Note } from "../Note.js";
import { effect } from "../../../effect.js";
import { buckets } from "../../../buckets.js";
import { flickClaimStart, flickGetClaimedStart } from "../../ScratchManager.js";
import { options } from '../../../../configuration/options.js'

export class ScratchNote extends Note {
    sprite: SkinSprite = skin.sprites.scratch
    effect = {
        linear: particle.effects.scratchNoteLinear,
        circular: particle.effects.scratchNoteCircular,
        fallback: {
            linear: particle.effects.scratchNoteLinearFallback,
            circular: particle.effects.scratchNoteCircularFallback,
        }
    }
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; fallback: { perfect: EffectClip; great: EffectClip; good: EffectClip } } = {
        perfect: effect.clips.scratchPerfect,
        great: effect.clips.scratchPerfect,
        good: effect.clips.scratchPerfect,
        fallback: {
            perfect: effect.clips.perfectAlt,
            great: effect.clips.greatAlt,
            good: effect.clips.goodAlt
        }
    }
    bucket: Bucket = buckets.scratchNote

    activatedTouchId = this.entityMemory(TouchId)
    touchPos = this.entityMemory(Vec)
    arrowPosition = this.entityMemory(Rect)
    sprites = this.entityMemory({
        note: SkinSpriteId,
        arrow: SkinSpriteId
    })
    played = this.entityMemory(Boolean)
    
    playEffect() {
        if (!options.noteEffectEnabled) return

        const lane = this.import.lane * 2.1

        const linear = linearEffectLayout({
            lane,
            size: 1.05
        })

        const circular = circularEffectLayout({
            lane,
            w: 1.05,
            h: 0.8
        })

        this.effect.linear.exists ? this.effect.linear.spawn(linear, 0.6, false) : this.effect.fallback.linear.spawn(linear, 0.6, false)
        this.effect.circular.exists ? this.effect.circular.spawn(circular, 0.6, false) : this.effect.fallback.circular.spawn(circular, 0.6, false)
    }

    preprocess() {
        super.preprocess()

        this.played = false

        this.sprites.note = this.sprite.exists ? this.sprite.id : skin.sprites.scratchFallback.id
        this.sprites.arrow = skin.sprites.scratchArrow.exists ? skin.sprites.scratchArrow.id : skin.sprites.scratchArrowFallback.id
    }

    drawNote() {
        skin.sprites.draw(this.sprites.note, perspectiveAdjust(this.notePosition, this.y), this.z, 1)

        const a1 = (time.now % 0.5) * 2
        const a2 = 1 - a1

        skin.sprites.draw(this.sprites.arrow, this.arrowPosition.mul(this.y), this.z + 1, a1)
        skin.sprites.draw(this.sprites.arrow, this.arrowPosition.add({ x: 0, y: -2 * note.radius }).mul(this.y), this.z + 1, a2)
    }

    updateSequential() {
        super.updateSequential()
        
        if (this.played) {
            if (time.now < this.targetTime) return
            this.complete(time.now)
            return
        }
        if (time.now < this.inputTime.min) return
        if (time.now > this.inputTime.max) this.incomplete(time.now)
        flickClaimStart(this.info.index)
        // debug.log(5555)
    }

    touch() {
        if (this.played) return
        if (time.now < this.inputTime.min) return
        let index = flickGetClaimedStart(this.info.index)
        if (index === -1) return
        this.played = true
        // debug.log(8888)
        // markAsUsedId(index)
        // debug.log(index)

        // const hitbox = this.getHitbox()

        // if(this.activatedTouchId) {
        //     for (const touch of touches) {
        //         if(touch.id !== this.activatedTouchId) continue

        //         // const d = touch.position.sub(touch.startPosition).length

        //         // if((d >= 0.04 * screen.w ) && (touch.vr > 2)) this.complete(touch)
        //         if (isClaimed(touch)) continue

        //         if(touch.ended) this.incomplete(time.now)
        //         else this.complete(touch)

        //         return
        //     }
        // } else {
        //     for (const touch of touches) {
        //         if(!hitbox.contains(touch.position)) continue
        //         if(!hitbox.contains(touch.startPosition)) continue
        //         if(isUsed(touch)) continue
        //         if(isClaimed(touch)) continue

        //         if (touch.started) {
        //             startClaim(touch)
        //             // markAsUsed(touch)
        //         }
        //         // debug.log(touch.id)

        //         this.activatedTouchId = touch.id
        //         return
        //     }
        // }
    }

    initialize() {
        super.initialize()
        
        const l = this.import.lane * 2.1 - 1.25
        const r = this.import.lane * 2.1 + 1.25

        new Rect({ l, r, b: 1 - note.radius * 2, t: 1 - note.radius * 6 }).copyTo(this.arrowPosition)
    }

    updateParallel() {
        super.updateParallel()

        if (!this.result.judgment || time.now <= this.targetTime /*+ this.windows.perfect.min*/) return
// // debug.log(this.result.judgment)

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }

    complete(hitTime: number) {
        const t = Math.max(Math.min(hitTime, this.targetTime + this.windows.perfect.max / 2), this.targetTime + this.windows.perfect.min / 2)
        this.result.judgment = input.judge(t, this.targetTime, this.windows)
        this.result.accuracy = t - this.targetTime
        
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
// debug.log(t)
        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        // this.playSFX()
        // this.playEffect()

        // claim(touch)

        // this.despawn = true
    }
}

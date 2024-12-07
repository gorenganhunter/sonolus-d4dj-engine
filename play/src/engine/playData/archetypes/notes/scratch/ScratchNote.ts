import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { approach, perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { Note } from "../Note.js";
import { effect } from "../../../effect.js";
import { buckets } from "../../../buckets.js";
import { startClaim, claim, isClaimed } from "../../ScratchManager.js";
import { options } from '../../../../configuration/options.js'

export class ScratchNote extends Note {
    sprite: SkinSprite = skin.sprites.scratch
    effect = {
        linear: particle.effects.scratchNoteLinear,
        circular: particle.effects.scratchNoteCircular,
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
    
    // playEffect() {
    //     particle.effects.scratch.spawn(this.notePosition, 0.2, false)
    //     particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    // }

    preprocess() {
        super.preprocess()

        this.sprites.note = this.sprite.exists ? this.sprite.id : skin.sprites.scratchFallback.id
        this.sprites.arrow = skin.sprites.scratchArrow.exists ? skin.sprites.scratchArrow.id : skin.sprites.scratchArrowFallback.id
    }

    drawNote() {
        skin.sprites.draw(this.sprites.note, this.notePosition.mul(this.y), this.z, 1)

        const a1 = (time.now % 0.5) * 2
        const a2 = 1 - a1

        skin.sprites.draw(this.sprites.arrow, this.arrowPosition.mul(this.y), this.z + 1, a1)
        skin.sprites.draw(this.sprites.arrow, this.arrowPosition.add({ x: 0, y: -2 * note.radius }).mul(this.y), this.z + 1, a2)
    }

    touch() {
        if(time.now < this.inputTime.min) return

        if(this.activatedTouchId) {
            for (const touch of touches) {
                if(touch.id !== this.activatedTouchId) continue

                // const d = touch.position.sub(touch.startPosition).length

                // if((d >= 0.04 * screen.w ) && (touch.vr > 2)) this.complete(touch)
                if (isClaimed(touch)) continue

                if(touch.ended) this.incomplete(time.now)
                else this.complete(touch)

                return
            }
        } else {
            for (const touch of touches) {
                if(!this.hitbox.contains(touch.position)) continue
                if(!this.hitbox.contains(touch.startPosition)) continue
                if(isUsed(touch)) continue
                if(isClaimed(touch)) continue

                if (touch.started) {
                    startClaim(touch)
                    // markAsUsed(touch)
                }
                // debug.log(touch.id)

                this.activatedTouchId = touch.id
                return
            }
        }
    }

    initialize() {
        super.initialize()
        
        const l = this.import.lane * 2.1 - 1.25
        const r = this.import.lane * 2.1 + 1.25

        new Rect({ l, r, b: 1 - note.radius * 2, t: 1 - note.radius * 6 }).copyTo(this.arrowPosition)
    }

    updateParallel() {
        super.updateParallel()

        if (!this.result.judgment || time.now <= this.targetTime + this.windows.perfect.min) return
// // debug.log(this.result.judgment)

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }

    complete(touch: Touch) {
        const t = Math.max(Math.min(time.now, this.targetTime + this.windows.perfect.max / 2), this.targetTime + this.windows.perfect.min / 2)
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

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        // this.playSFX()
        // this.playEffect()

        claim(touch)

        // this.despawn = true
    }
}

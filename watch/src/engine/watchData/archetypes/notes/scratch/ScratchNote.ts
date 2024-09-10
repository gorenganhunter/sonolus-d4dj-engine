import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { approach, perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
// import { isUsed, markAsUsed } from "../../InputManager.js";
import { Note } from "../Note.js";
import { effect } from "../../../effect.js";
import { buckets } from "../../../buckets.js";
import { windows } from "../../../windows.js";
// import { claim, isClaimed } from "../../ScratchManager.js";
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

    // activatedTouchId = this.entityMemory(TouchId)
    touchPos = this.entityMemory(Vec)
    arrowPosition = this.entityMemory(Quad)
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

        this.sprites.note = skin.sprites.scratch.exists ? skin.sprites.scratch.id : skin.sprites.scratchFallback.id
        this.sprites.arrow = skin.sprites.scratchArrow.exists ? skin.sprites.scratchArrow.id : skin.sprites.scratchArrowFallback.id
    }

    drawNote() {
        skin.sprites.draw(this.sprites.note, this.notePosition.mul(this.y), this.z, 1)
        skin.sprites.draw(this.sprites.arrow, this.arrowPosition.mul(this.y), this.z + 1, 1)
    }

    // touch() {
    //     if(time.now < this.inputTime.min) return

    //     if(this.activatedTouchId) {
    //         for (const touch of touches) {
    //             if(touch.id !== this.activatedTouchId) continue

    //             // const d = touch.position.sub(touch.startPosition).length

    //             // if((d >= 0.04 * screen.w ) && (touch.vr > 2)) this.complete(touch)
    //             if (isClaimed(touch)) continue

    //             if(touch.ended) this.incomplete(touch.t)
    //             else this.complete(touch)

    //             return
    //         }
    //     } else {
    //         for (const touch of touches) {
    //             if(!this.hitbox.contains(touch.position)) continue
    //             if(!this.hitbox.contains(touch.startPosition)) continue
    //             if(isUsed(touch)) continue
    //             if(isClaimed(touch)) continue

    //             // debug.log(touch.id)

    //             this.activatedTouchId = touch.id
    //             return
    //         }
    //     }
    // }

    initialize() {
        super.initialize()
        
        const l = this.import.lane * 2.1 - 1.05
        const r = this.import.lane * 2.1 + 1.05

        perspectiveLayout({ l, r, b: 1 - note.radius * 2, t: 1 - note.radius * 4 }).copyTo(this.arrowPosition)
    }

//     updateParallel() {
//         super.updateParallel()

//         // if (!this.result.judgment || time.now <= this.targetTime) return
// // debug.log(this.result.judgment)
//         if (options.sfxEnabled) switch (this.import.judgment) {
//             case Judgment.Perfect:
//                 this.sfx.perfect.play(0.02)
//                 break
//             case Judgment.Great:
//                 this.sfx.great.play(0.02)
//                 break
//             case Judgment.Good:
//                 this.sfx.good.play(0.02)
//                 break
//         }
//         
//         this.playEffect()

//         // this.despawn = true
//     }

    // complete(touch: Touch) {
    //     this.result.judgment = input.judge(Math.min(Math.max(touch.t, this.targetTime + windows.perfect.min + 0.00001), this.targetTime + windows.perfect.max - 0.00001), this.targetTime, windows)
    //     this.result.accuracy = touch.t - this.targetTime
    //     
    //     // if (options.sfxEnabled) switch (this.result.judgment) {
    //     //     case Judgment.Perfect:
    //     //         this.sfx.perfect.play(0.02)
    //     //         break
    //     //     case Judgment.Great:
    //     //         this.sfx.great.play(0.02)
    //     //         break
    //     //     case Judgment.Good:
    //     //         this.sfx.good.play(0.02)
    //     //         break
    //     // }

    //     this.result.bucket.index = this.bucket.index
    //     this.result.bucket.value = this.result.accuracy * 1000

    //     // this.playEffect()

    //     claim(touch)

    //     // this.despawn = true
    // }
}

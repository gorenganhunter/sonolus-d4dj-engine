import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { approach, perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { Note } from "../Note.js";
import { effect } from "../../../effect.js";
import { buckets } from "../../../buckets.js";
import { windows } from "../../../windows.js";
import { claim, isClaimed } from "../../ScratchManager.js";

export class ScratchNote extends Note {
    sprite: SkinSprite = skin.sprites.scratch
    effect: ParticleEffect = particle.effects.scratch
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; } = {
        perfect: effect.clips.scratchPerfect,
        great: effect.clips.scratchGreat,
        good: effect.clips.scratchGood
    }
    bucket: Bucket = buckets.scratchNote

    activatedTouchId = this.entityMemory(TouchId)
    touchPos = this.entityMemory(Vec)
    arrowPosition = this.entityMemory(Quad)
    
    // playEffect() {
    //     particle.effects.scratch.spawn(this.notePosition, 0.2, false)
    //     particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    // }

    drawNote() {
        // this.y = approach(this.visualTime.min, this.visualTime.max, time.now - this.targetTime + this.visualTime.max)
        super.drawNote()
        skin.sprites.scratchArrow.draw(this.arrowPosition.mul(this.y), this.z + 1, 1)
    }

    touch() {
        if(time.now < this.inputTime.min) return

        if(this.activatedTouchId) {
            for (const touch of touches) {
                if(touch.id !== this.activatedTouchId) continue

                // const d = touch.position.sub(touch.startPosition).length

                // if((d >= 0.04 * screen.w ) && (touch.vr > 2)) this.complete(touch)
                if (isClaimed(touch)) continue

                if(touch.ended) this.incomplete(touch.t)
                else this.complete(touch)

                return
            }
        } else {
            for (const touch of touches) {
                if(!this.hitbox.contains(touch.position)) continue
                if(!this.hitbox.contains(touch.startPosition)) continue
                if(isUsed(touch)) continue
                if(isClaimed(touch)) continue

                this.activatedTouchId = touch.id
                return
            }
        }
    }

    initialize() {
        super.initialize()
        
        const l = this.import.lane * 2.1 - 1.05
        const r = this.import.lane * 2.1 + 1.05

        perspectiveLayout({ l, r, b: 1 - note.radius * 2, t: 1 - note.radius * 4 }).copyTo(this.arrowPosition)
    }

    complete(touch: Touch) {
        this.result.judgment = input.judge(touch.t, this.targetTime, windows)
        this.result.accuracy = touch.t - this.targetTime
// debug.log(touch.t)
        switch (this.result.judgment) {
            case Judgment.Perfect:
                this.sfx.perfect.play(0.02)
                break
            case Judgment.Great:
                this.sfx.great.play(0.02)
                break
            case Judgment.Good:
                this.sfx.good.play(0.02)
                break
        }

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playEffect()

        claim(touch)

        this.despawn = true
    }
}

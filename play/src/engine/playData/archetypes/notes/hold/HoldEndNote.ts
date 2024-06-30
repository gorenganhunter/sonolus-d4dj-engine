import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { windows } from "../../../windows.js";
import { queueHold } from "../../HoldManager.js";
import { HoldNote } from "./HoldNote.js";

export class HoldEndNote extends HoldNote {

    sprite = skin.sprites.holdTail
    effect = particle.effects.holdNote
    bucket = buckets.holdEndNote

    preprocess() {
        super.preprocess()

        const minPrevInputTime =
            bpmChanges.at(this.prevImport.beat).time + windows.good.min + input.offset

        this.spawnTime = Math.min(this.spawnTime, minPrevInputTime)
    }
    
    touch() {
        const id = this.prevSingleSharedMemory.activatedTouchId
        if (id) {
            for (const touch of touches) {
                if (touch.id !== id) continue

                if (!touch.ended) {
                    if (time.now >= (this.targetTime + windows.perfect.max)) return this.complete(this.targetTime + windows.perfect.max - 0.0001)
                    else return queueHold(this.holdImport.prevRef)
                }

                if (time.now >= this.inputTime.min && this.hitbox.contains(touch.position)) {
                    this.complete(touch.t)
                } else {
                    this.incomplete(touch.t)
                }
                return
            }

            if (time.now >= this.inputTime.min) {
                this.complete(time.now)
            } else {
                this.incomplete(time.now)
            }
            return
        }

        if (this.prevInfo.state !== EntityState.Despawned) return
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!touch.ended) continue
            if (!this.hitbox.contains(touch.position)) continue

            this.complete(touch.t)
            return
        }
    }

    complete(hitTime: number) {
        this.result.judgment = input.judge(hitTime, this.targetTime, windows)
        this.result.accuracy = hitTime - this.targetTime
        
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

        this.despawn = true
    }

    // playEffect() {
    //     this.effect.spawn(this.notePosition, 0.2, false)
    // }

    // drawNote() {
    //     this.sprite.draw(this.notePosition.mul(this.y), this.z, 1)
    // }
}

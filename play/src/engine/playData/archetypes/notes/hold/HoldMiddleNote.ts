import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { queueHold } from "../../HoldManager.js";
import { HoldNote } from "./HoldNote.js";
import { options } from '../../../../configuration/options.js'
import { note } from "../../../note.js";

export class HoldMiddleNote extends HoldNote {
    sprite = skin.sprites.holdMiddle
    bucket = buckets.holdMiddleNote

    preprocess() {
        super.preprocess()

        const minPrevInputTime =
            bpmChanges.at(this.prevImport.beat).time + this.windows.good.min + input.offset

        this.spawnTime = Math.min(this.spawnTime, minPrevInputTime)
    }

    updateParallel() {
        if (
            this.prevInfo.state === EntityState.Despawned &&
            !this.prevSingleSharedMemory.activatedTouchId
        )
            this.despawn = true

        super.updateParallel()
    }

    drawNote() { }

    touch() {
        const id = this.prevSingleSharedMemory.activatedTouchId
        const hitbox = this.getHitbox()

        if (!id) return

        for (const touch of touches) {
            if (touch.id !== id) continue

            if (!touch.ended) {
                if (time.now > this.targetTime && hitbox.contains(touch.position)) return this.complete(id, this.targetTime)
                else return queueHold(this.holdImport.prevRef)
            }

            if ((time.now >= this.inputTime.min && hitbox.contains(touch.position))) {
                this.complete(id, touch.t)
            } else {
                this.incomplete(touch.t)
            }
            return
        }

        if (time.now >= this.inputTime.min) {
            this.complete(id, time.now)
        } else {
            this.incomplete(time.now)
        }
        return
        // }
        //
        // if (this.prevInfo.state !== EntityState.Despawned) return
        // if (time.now < this.inputTime.min) return
        //
        // for (const touch of touches) {
        //     if (!touch.ended) continue
        //     if (!hitbox.contains(touch.position)) continue
        //
        //     this.complete(touch.t)
        //     return
        // }
    }

    complete(id: TouchId, hitTime: number) {
        this.sharedMemory.activatedTouchId = id

        this.result.judgment = input.judge(hitTime, this.targetTime, this.windows)
        this.result.accuracy = hitTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
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

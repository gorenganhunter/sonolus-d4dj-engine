import { perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { windows } from "../../../windows.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { HoldNote } from "./HoldNote.js";
import { options } from '../../../../configuration/options.js'

export class HoldStartNote extends HoldNote {
    sprite = skin.sprites.holdHead
    bucket = buckets.holdStartNote

    // playEffect() {
    //     this.effect.spawn(this.notePosition, 0.2, false)
    //     particle.effects.lane.spawn(perspectiveLayout({ l: (this.import.lane * 24) / 100 - 0.12, r: (this.import.lane * 24) / 100 + 0.12, b: 1 + note.radius, t: 1 - note.radius * 2 }), 0.2, false)
    // }

    // drawNote() {
    //     this.sprite.draw(this.notePosition.mul(this.y), this.z, 1)
    // }
    
    touch() {
        if (time.now < this.inputTime.min) return

        for (const touch of touches) {
            if (!this.hitbox.contains(touch.position)) continue
            if (!touch.started) continue
            if (isUsed(touch)) continue

            this.complete(touch)

            return
        }
    }
    
    complete(touch: Touch) {
        markAsUsed(touch)
        this.sharedMemory.activatedTouchId = touch.id

        this.result.judgment = input.judge(touch.startTime, this.targetTime, windows)
        this.result.accuracy = touch.startTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        this.playEffect()

        this.despawn = true
    }
}

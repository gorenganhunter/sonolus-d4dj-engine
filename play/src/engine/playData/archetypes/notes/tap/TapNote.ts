import { buckets } from "../../../buckets.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { Note } from "../Note.js";
import { options } from '../../../../configuration/options.js'
import { note } from "../../../note.js";

export abstract class TapNote extends Note {
    bucket: Bucket = buckets.tapNote

    touch() {
        if (time.now < this.inputTime.min) return

        const hitbox = this.getHitbox()

        for (const touch of touches) {
            if (!hitbox.contains(touch.position)) continue
            if (!touch.started) continue
            if (isUsed(touch)) continue

            this.complete(touch)

            return
        }
    }

    complete(touch: Touch) {
        this.result.judgment = input.judge(touch.startTime, this.targetTime, this.windows)
        this.result.accuracy = touch.startTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        this.playEffect()

        markAsUsed(touch)

        this.despawn = true
    }
}

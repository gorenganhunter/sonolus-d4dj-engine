import { buckets } from "../../../buckets.js";
import { windows } from "../../../windows.js";
import { isUsed, markAsUsed } from "../../InputManager.js";
import { Note } from "../Note.js";
import { options } from '../../../../configuration/options.js'

export abstract class TapNote extends Note {
    bucket: Bucket = buckets.tapNote

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
        this.result.judgment = input.judge(touch.startTime, this.targetTime, windows)
        this.result.accuracy = touch.startTime - this.targetTime

        this.result.bucket.index = this.bucket.index
        this.result.bucket.value = this.result.accuracy * 1000

        this.playSFX()
        this.playEffect()

        markAsUsed(touch)

        this.despawn = true
    }
}

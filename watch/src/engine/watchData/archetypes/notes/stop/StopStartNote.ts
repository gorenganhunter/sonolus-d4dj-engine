import { approach } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { particle } from "../../../particle.js";
import { effect } from "../../../effect.js";
import { skin } from "../../../skin.js";
import { HoldStartNote } from "../hold/HoldStartNote.js";

export class StopStartNote extends HoldStartNote {
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; fallback: { perfect: EffectClip; great: EffectClip; good: EffectClip } } = {
        perfect: effect.clips.scratchPerfect,
        great: effect.clips.scratchPerfect,
        good: effect.clips.scratchPerfect,
        fallback: {
            perfect: effect.clips.perfect,
            great: effect.clips.great,
            good: effect.clips.good
        }
    }
    sprite = skin.sprites.stopHead
    effect = {
        linear: particle.effects.stopNoteLinear,
        circular: particle.effects.stopNoteCircular
    }
    bucket = buckets.stopStartNote

    // drawNote() {
    //     // this.y = approach(this.visualTime.min, this.visualTime.max, time.now + this.visualTime.max - this.targetTime)
    //     // debug.log(this.y)
    //     super.drawNote()
    // }
    // preprocess() {
    //     super.preprocess()
    //     debug.log(this.visualTime.min)
    // }
    // updateSequential() {
    //     super.updateSequential()

    //     if (time.now < this.targetTime) return
    //     if (this.setBackspin) return

    //     backspin.time = time.now
    //     backspin.diff = time.now - time.scaled
    //     backspin.used = this.index
    // }
}

import { approach } from "../../../../../../../shared/src/engine/data/utils.js";
import { buckets } from "../../../buckets.js";
import { effect } from "../../../effect.js";
import { note } from "../../../note.js";
import { particle } from "../../../particle.js";
import { skin } from "../../../skin.js";
import { HoldEndNote } from "../hold/HoldEndNote.js";

export class StopEndNote extends HoldEndNote {
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
    sprite = skin.sprites.stopTail
    effect = {
        linear: particle.effects.stopNoteLinear,
        circular: particle.effects.stopNoteCircular
    }
    bucket = buckets.stopEndNote

    // head = this.entityMemory({
    //     time: Number,
    //     scaled: Number
    // })

    // preprocess() {
    //     super.preprocess()

    //     // this.head.time = bpmChanges.at(this.prevImport.beat).time
    //     // this.head.scaled = timeScaleChanges.at(this.head.time).scaledTime

    //     // // this.visualTime.min += this.visualTime.max - this.head.time
    //     // this.spawnTime = this.visualTime.min

    //     // debug.log(this.visualTime.min)
    //     // debug.log(this.visualTime.max)
    // }

    // drawNote() {
    //     // this.y = approach(this.visualTime.min, this.visualTime.max, time.now + this.visualTime.max - this.targetTime)
    //     // debug.log(this.y)
    //     super.drawNote()
    // }
}

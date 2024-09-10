import { effect } from "../../../effect.js";
import { particle } from "../../../particle.js";
import { Note } from "../Note.js";

export abstract class HoldNote extends Note {
    sfx: { perfect: EffectClip; great: EffectClip; good: EffectClip; fallback: { perfect: EffectClip; great: EffectClip; good: EffectClip } } = {
        perfect: effect.clips.longPerfect,
        great: effect.clips.longGreat,
        good: effect.clips.longGood,
        fallback: {
            perfect: effect.clips.perfect,
            great: effect.clips.great,
            good: effect.clips.good
        }
    }
    effect = {
        linear: particle.effects.holdNoteLinear,
        circular: particle.effects.holdNoteCircular,
    }

    holdImport = this.defineImport({
        prevRef: { name: "head", type: Number }
    })

    // sharedMemory = this.defineSharedMemory({
    //     activatedTouchId: TouchId,
    //     // y: Number
    // })

    // updateParallel() {
    //     super.updateParallel()

    //     // if (this.y) this.sharedMemory.y = this.y
    // }

    get prevInfo() {
        return entityInfos.get(this.holdImport.prevRef)
    }

    get prevImport() {
        return this.import.get(this.holdImport.prevRef)
    }

    // get prevSingleSharedMemory() {
    //     return this.sharedMemory.get(this.holdImport.prevRef)
    // }
}

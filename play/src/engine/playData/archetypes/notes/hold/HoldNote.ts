import { effect } from "../../../effect.js";
import { Note } from "../Note.js";

export abstract class HoldNote extends Note {
    sfx = {
        perfect: effect.clips.longPerfect,
        great: effect.clips.longGreat,
        good: effect.clips.longGood
    }

    holdImport = this.defineImport({
        prevRef: { name: "prev", type: Number }
    })

    sharedMemory = this.defineSharedMemory({
        activatedTouchId: TouchId,
        // y: Number
    })

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

    get prevSingleSharedMemory() {
        return this.sharedMemory.get(this.holdImport.prevRef)
    }
}

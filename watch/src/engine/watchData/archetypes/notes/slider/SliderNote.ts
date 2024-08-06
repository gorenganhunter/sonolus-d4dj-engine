import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { note } from "../../../note.js";
import { skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { Note } from "../Note.js";
import { particle } from "../../../particle.js";
import { effect } from "../../../effect.js";
import { archetypes } from "../../index.js";

export abstract class SliderNote extends Note {
    sprite: SkinSprite = skin.sprites.sliderNote
    effect = {
        linear: particle.effects.sliderNoteLinear,
        circular: particle.effects.sliderNoteCircular
    }

    sliderImport = this.defineImport({
        prev: { name: "prev", type: Number },
        next: { name: "next", type: Number },
        direction: { name: "direction", type: Number },
        // target: { name: "target", type: Number }
    })

    drawNote() {
        const l = this.import.lane * 2.1 - 0.5
        const r = this.import.lane * 2.1 + 0.5

        perspectiveLayout({ l, r, t: 1 - note.radius * 2, b: 1 + note.radius * 2 }).copyTo(this.notePosition)

        skin.sprites.sliderNote.draw(this.notePosition.mul(this.y), 100, 1)
    }

    preprocess() {
        super.preprocess()

        // HONOKAAA HELP MEEEEEEE.........!!!!!!!
        if (this.sliderImport.next) archetypes.Honoka.spawn({ start: this.targetTime, startLane: this.import.lane, end: bpmChanges.at(this.nextImport.beat).time, endLane: this.nextImport.lane, flick: false })
        if (this.sliderImport.direction) archetypes.Honoka.spawn({ start: this.targetTime, startLane: this.import.lane, end: this.targetTime + 0.2, endLane: this.import.lane + this.sliderImport.direction, flick: true })

        if (this.import.beat < slider.next.beat) {
            slider.next.beat = this.import.beat
            slider.next.lane = this.import.lane
            // debug.log(slider.next.lane)
        }
    }

    // terminate() {
    //     super.terminate()
    //     // debug.log(time.now)
    //     // if (this.sliderImport.next) archetypes.Honoka.spawn({ time: time.now, next: this.nextImport.beat, lane: this.nextImport.lane })
    // }


    get prevImport() {
        return this.import.get(this.sliderImport.prev)
    }

    get prevInfo() {
         return entityInfos.get(this.sliderImport.prev)
    }

    get nextImport() {
        return this.import.get(this.sliderImport.next)
    }
}
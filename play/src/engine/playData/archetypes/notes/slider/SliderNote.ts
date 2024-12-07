import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { note } from "../../../note.js";
import { skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { Note } from "../Note.js";
import { particle } from "../../../particle.js";
import { effect } from "../../../effect.js";
import { options } from "../../../../configuration/options.js";

export abstract class SliderNote extends Note {
    sprite: SkinSprite = skin.sprites.sliderNote
    effect = {
        linear: particle.effects.sliderNoteLinear,
        circular: particle.effects.sliderNoteCircular
    }

    shadow = skin.sprites.shadowSlider

    touchOrder = 2

    sliderImport = this.defineImport({
        prev: { name: "prev", type: Number },
        next: { name: "next", type: Number },
        direction: { name: "direction", type: Number },
        // target: { name: "target", type: Number }
    })

    drawNote() {
        const l = this.import.lane * 2.1 - 0.66
        const r = this.import.lane * 2.1 + 0.66

        perspectiveLayout({ l, r, t: 1 - note.radius * 2.5, b: 1 + note.radius * 2.5 }).copyTo(this.notePosition)

        skin.sprites.sliderNote.draw(this.notePosition.mul(this.y), this.z, 1)
        if (time.now < this.bsTime) this.shadow.draw(this.notePosition.mul(this.y), this.z + 1, 1 - options.backspinBrightness)
    }

    preprocess() {
        super.preprocess()
        if (this.import.beat < slider.next.beat) {
            slider.next.beat = this.import.beat
            slider.next.lane = this.import.lane
            slider.next.timescaleGroup = this.import.timescaleGroup
        }
    }


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

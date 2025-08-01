import { EffectClip, ParticleEffect, SkinSprite } from "@sonolus/sonolus.js-compiler/play";
import { perspectiveLayout } from "../../../../../../../shared/src/engine/data/utils.js";
import { note } from "../../../note.js";
import { skin } from "../../../skin.js";
import { slider } from "../../../slider.js";
import { Note } from "../Note.js";
import { particle } from "../../../particle.js";
import { effect } from "../../../effect.js";
import { archetypes } from "../../index.js";
import { options } from "../../../../configuration/options.js";

export abstract class SliderNote extends Note {
    sprite: SkinSprite = skin.sprites.sliderNote
    effect = {
        linear: particle.effects.sliderNoteLinear,
        circular: particle.effects.sliderNoteCircular
    }

    shadow = skin.sprites.shadowSlider

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

        // HELP ME HONOKAAAAAAAAAA.........!!!!!!!
        if (this.sliderImport.next) {
            archetypes.Honoka.spawn({ startBeat: this.import.beat, endBeat: this.nextImport.beat, start: this.targetTime, startLane: this.import.lane, startTSG: this.import.timescaleGroup, end: bpmChanges.at(this.nextImport.beat).time, endLane: this.nextImport.lane, endTSG: this.nextImport.timescaleGroup, flick: false, judgment: this.import.judgment, hitTime: this.hitTime, nextHitTime: bpmChanges.at(this.nextImport.beat).time + this.nextImport.accuracy })
        }
        if (this.sliderImport.direction && !replay.isReplay) {
            archetypes.Honoka.spawn({ startBeat: this.import.beat, endBeat: this.import.beat + (0.05 * Math.abs(this.sliderImport.direction) * bpmChanges.at(this.targetTime).bpm / 60), start: this.targetTime, startLane: this.import.lane, startTSG: this.import.timescaleGroup, end: this.targetTime + 0.05 * Math.abs(this.sliderImport.direction), endLane: this.import.lane + this.sliderImport.direction, endTSG: this.import.timescaleGroup, flick: true, judgment: this.import.judgment, hitTime: 0, nextHitTime: 0 })
            if (options.noteEffectEnabled) archetypes.SliderFlickParticle.spawn({ start: this.targetTime, startLane: this.import.lane, direction: this.sliderImport.direction })
        }

        if (this.sliderImport.direction && replay.isReplay && this.import.judgment) {
            if (options.noteEffectEnabled) archetypes.SliderFlickParticle.spawn({ start: this.hitTime, startLane: this.import.lane, direction: this.sliderImport.direction })
        }

        if (this.import.beat < slider.next.beat) {
            slider.next.beat = this.import.beat
            slider.next.lane = this.import.lane
            slider.position = this.import.lane * 2.1
            slider.next.timescaleGroup = this.import.timescaleGroup
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

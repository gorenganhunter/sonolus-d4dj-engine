import { skin, layer, getZ } from "../../../skin.js";
import { Note } from "../Note.js";
import { options } from '../../../../configuration/options.js'
import { panel } from "../../../panel.js"
import { note } from "../../../note.js"

export abstract class SliderNote extends Note {
    sprite = skin.sprites.sliderNote

    render() {
        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        const z = getZ(layer.note.body, time, this.import.lane)

        this.sprite.draw(
            new Rect({
                l: this.import.lane - 0.125 * options.noteSize,
                r: this.import.lane + 0.125 * options.noteSize,
                b: -note.h * 1.25 * options.noteSize,
                t: note.h * 1.25 * options.noteSize,
            }).add(pos),
            z,
            1,
        )

        return { time, pos }
    }
}

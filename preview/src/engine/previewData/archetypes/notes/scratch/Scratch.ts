import { options } from "../../../../configuration/options.js";
import { panel } from "../../../panel.js";
import { skin, getZ, layer } from "../../../skin.js";
import { Note } from "../Note.js";

export class ScratchNote extends Note {
    sprite = skin.sprites.scratch

    render() {
        const { time, pos } = super.render()

        const z = getZ(layer.note.arrow, time, this.import.lane)

        skin.sprites.scratchArrow.draw(
            new Rect({
                l: this.import.lane - 0.5 * options.noteSize,
                r: this.import.lane + 0.5 * options.noteSize,
                b: 0,
                t: panel.h / 25 * options.noteSize,
            }).add(pos),
            z,
            1,
        )

        return { time, pos }
    }
}

import { options } from "../../../../configuration/options.js";
import { note } from "../../../note.js";
import { skin, layer, getZ } from "../../../skin.js";
import { SliderNote } from "./SliderNote.js";

export class SliderFlickNote extends SliderNote {
    sliderImport = this.defineImport({
        direction: { name: "direction", type: Number }
    })

    render() {
        const { time, pos } = super.render()
        
        const z = getZ(layer.note.arrow, time, this.import.lane)

        const b = -note.h * 1.25 * options.noteSize
        const t = note.h * 1.25 * options.noteSize

        if (this.sliderImport.direction > 0) for (let i = 1; i <= this.sliderImport.direction; i++) {
            const lane = this.import.lane + i - 0.5
            const layout = new Rect({
                l: lane + options.noteSize / 1.5,
                r: lane,
                b,
                t
            }).add(pos)
            skin.sprites.sliderArrow.draw(layout, z, 1)
        }
        else for (let i = -1; i >= this.sliderImport.direction; i--) {
            const lane = this.import.lane + i + 0.5
            const layout = new Rect({
                l: lane - options.noteSize / 1.5,
                r: lane,
                b,
                t
            }).add(pos)
            skin.sprites.sliderArrow.draw(layout, z, 1)
        }

        return { time, pos }
    }
}

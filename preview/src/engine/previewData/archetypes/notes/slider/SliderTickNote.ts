import { panel } from "../../../panel.js";
import { getZ, layer, skin } from "../../../skin.js";
import { options } from "../../../../configuration/options.js"
import { SliderNote } from "./SliderNote.js";

export class SliderTickNote extends SliderNote {
    sliderImport = this.defineImport({
        next: { name: 'next', type: Number },
    })

    render() {
        const { time, pos } = super.render()

        if (this.sliderImport.next) {
            const t = {
                min: time,
                max: bpmChanges.at(this.nextImport.beat).time,
            }

            const index = {
                min: Math.floor(t.min / panel.h),
                max: Math.floor(t.max / panel.h),
            }

            const lane = {
                min: this.import.lane,
                max: this.nextImport.lane,
            }

            const z = getZ(layer.note.connector, t.min, this.import.lane)

            for (let i = index.min; i <= index.max; i++) {
                const x = i * panel.w

                const pt = {
                    min: Math.max(t.min, i * panel.h),
                    max: Math.min(t.max, (i + 1) * panel.h),
                }

                const pl = {
                    min: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.min)),
                    max: Math.lerp(lane.min, lane.max, Math.unlerp(t.min, t.max, pt.max)),
                }

                const pos = {
                    min: new Vec(x, pt.min - i * panel.h),
                    max: new Vec(x, pt.max - i * panel.h),
                }

                const layout = new Quad({
                    p1: pos.min.translate(pl.min - 0.5 * 0.7 * 0.2 * options.noteSize, 0),
                    p2: pos.max.translate(pl.max - 0.5 * 0.7 * 0.2 * options.noteSize, 0),
                    p3: pos.max.translate(pl.max + 0.5 * 0.7 * 0.2 * options.noteSize, 0),
                    p4: pos.min.translate(pl.min + 0.5 * 0.7 * 0.2 * options.noteSize, 0),
                })

                skin.sprites.sliderConnector.draw(layout, z, options.connectorAlpha)
            }
        }

        return { time, pos }
    }

    get nextImport() {
        return this.import.get(this.sliderImport.next)
    }
}

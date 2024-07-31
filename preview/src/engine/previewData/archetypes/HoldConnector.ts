import { options } from '../../configuration/options.js'
import { panel } from '../panel.js'
import { getZ, layer, skin } from '../skin.js'
import { archetypes } from './index.js'

export class HoldConnector extends Archetype {
    import = this.defineImport({
        headRef: { name: 'head', type: Number },
        tailRef: { name: 'tail', type: Number },
    })

    render() {
        const t = {
            min: bpmChanges.at(this.headImport.beat).time,
            max: bpmChanges.at(this.tailImport.beat).time,
        }

        const index = {
            min: Math.floor(t.min / panel.h),
            max: Math.floor(t.max / panel.h),
        }

        const lane = {
            min: this.headImport.lane,
            max: this.tailImport.lane,
        }

        const z = getZ(layer.note.connector, t.min, this.headImport.lane)

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
                p1: pos.min.translate(pl.min - 0.5 * 0.7 * options.noteSize, 0),
                p2: pos.max.translate(pl.max - 0.5 * 0.7 * options.noteSize, 0),
                p3: pos.max.translate(pl.max + 0.5 * 0.7 * options.noteSize, 0),
                p4: pos.min.translate(pl.min + 0.5 * 0.7 * options.noteSize, 0),
            })

            if (this.headImport.lane === 3 || this.headImport.lane === -3) skin.sprites.stopConnector.draw(layout, z, options.connectorAlpha)
            else skin.sprites.holdConnector.draw(layout, z, options.connectorAlpha)
        }
    }

    get headImport() {
        return archetypes.HoldStartNote.import.get(this.import.headRef)
    }

    get tailImport() {
        return archetypes.HoldEndNote.import.get(this.import.tailRef)
    }
}

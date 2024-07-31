import { EngineArchetypeDataName } from '@sonolus/core'
import { options } from '../../../configuration/options.js'
import { note } from '../../note.js'
import { panel } from '../../panel.js'
import { getZ, layer, skin } from '../../skin.js'
import { print } from '../../print.js'

export class BarLine extends Archetype {
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number }
    })

    render() {
        if (!options.barLine) return

        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        const z = getZ(layer.simLine, time, 0)

        const b = -note.h / 2 * options.noteSize
        const t = note.h / 2 * options.noteSize

        skin.sprites.simLine.draw(new Rect({ l: -3.5, r: 3.5, b, t }).add(pos), z, 1)

        print(time, time, PrintFormat.Time, 2, PrintColor.Theme, "left")
    }
}

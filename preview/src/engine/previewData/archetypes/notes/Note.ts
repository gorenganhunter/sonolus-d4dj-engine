import { EngineArchetypeDataName } from '@sonolus/core'
import { options } from '../../../configuration/options.js'
import { chart } from '../../chart.js'
import { panel } from "../../panel.js"
import { note } from "../../note.js"
import { layer, getZ } from "../../skin.js"

export abstract class Note extends Archetype {
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        lane: { name: 'lane', type: Number },
    })
    
    abstract sprite: SkinSprite

    preprocess() {
        chart.beats = Math.max(chart.beats, this.import.beat)
        chart.duration = Math.max(chart.duration, bpmChanges.at(this.import.beat).time)

        if (options.mirror) this.import.lane *= -1
    }

    render() {
        const time = bpmChanges.at(this.import.beat).time
        const pos = panel.getPos(time)

        const z = getZ(layer.note.body, time, this.import.lane)

        this.sprite.draw(
            new Rect({
                l: this.import.lane - 0.5 * options.noteSize,
                r: this.import.lane + 0.5 * options.noteSize,
                b: -note.h * options.noteSize,
                t: note.h * options.noteSize,
            }).add(pos),
            z,
            1,
        )

        return { time, pos }
    }
}

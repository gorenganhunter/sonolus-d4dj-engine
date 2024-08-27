import { EngineArchetypeDataName } from '@sonolus/core'
import { print } from '../print.js'
import { line, skin } from '../skin.js'

export class TimeScaleChange extends Archetype {
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: "timeScale", type: Number },
    })

    render() {
        line(skin.sprites.holdConnector, this.import.beat, 0.75)

        print(
            this.import.timeScale,
            bpmChanges.at(this.import.beat).time,
            PrintFormat.TimeScale,
            'auto',
            PrintColor.Yellow,
            'right',
        )
    }
}

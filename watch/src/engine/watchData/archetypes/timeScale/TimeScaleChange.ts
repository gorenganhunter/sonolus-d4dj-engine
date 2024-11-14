import { EngineArchetypeDataName } from '@sonolus/core'

export class TimeScaleChange extends Archetype {
    data = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timeScale: { name: 'timeScale', type: Number },
        nextRef: { name: 'next', type: Number },
        disc: { name: 'disc', type: Number }
    })
}

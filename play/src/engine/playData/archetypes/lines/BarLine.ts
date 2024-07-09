import { EngineArchetypeDataName } from "@sonolus/core"
import { note } from "../../note.js"
import { approach, leftRotated, perspectiveLayout } from "../../../../../../shared/src/engine/data/utils.js"
import { skin } from "../../skin.js"
import { options } from '../../../configuration/options.js'

export class BarLine extends Archetype {
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number }
    })

    visualTime = this.entityMemory({
        min: Number,
        max: Number
    })

    spawnTime = this.entityMemory(Number)
    targetTime = this.entityMemory(Number)

    preprocess() {
        if (!options.barLine) return

        this.targetTime = bpmChanges.at(this.import.beat).time

        this.visualTime.max = timeScaleChanges.at(this.targetTime).scaledTime
        this.visualTime.min = this.visualTime.max - note.duration

        this.spawnTime = this.visualTime.min
    }

    spawnOrder() {
        if (!options.barLine) return 100000

        return 1000 + this.spawnTime
    }

    shouldSpawn() {
        return (time.scaled >= this.spawnTime) && options.barLine
    }

    updateParallel() {
        if (time.scaled > this.visualTime.max) this.despawn = true
        if (this.despawn) return

        const y = approach(this.visualTime.min, this.visualTime.max, time.scaled)

        skin.sprites.simLine.draw(perspectiveLayout({ l: -5.25, r: 5.25, t: 0.99, b: 1.01 }).mul(y), 999 - this.targetTime, 1)
    }
}

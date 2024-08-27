import { EngineArchetypeDataName } from "@sonolus/core"
import { note, getSpawnTime } from "../../note.js"
import { approach, leftRotated, perspectiveLayout } from "../../../../../../shared/src/engine/data/utils.js"
import { skin } from "../../skin.js"
import { options } from '../../../configuration/options.js'
import { scaledTimeToEarliestTime, timeToScaledTime } from "../timeScale.js"

export class BarLine extends Archetype {
    import = this.defineImport({
        beat: { name: EngineArchetypeDataName.Beat, type: Number },
        timescaleGroup: { name: "timeScaleGroup", type: Number }
    })

    visualTime = this.entityMemory({
        min: Number,
        max: Number
    })

    // spawnTime = this.entityMemory(Number)
    targetTime = this.entityMemory(Number)

    preprocess() {
        if (!options.barLine) return

        this.targetTime = bpmChanges.at(this.import.beat).time

        this.visualTime.max = options.backspinAssist ? this.targetTime : timeToScaledTime(this.targetTime, this.import.timescaleGroup)
        this.visualTime.min = this.visualTime.max - note.duration

        // this.spawnTime = this.visualTime.min
    }

    spawnTime() {
        return options.backspinAssist ? this.visualTime.min : scaledTimeToEarliestTime(
            Math.min(
                this.visualTime.min,
                this.visualTime.max
            ),
            this.import.timescaleGroup
        )
    }

    despawnTime() {
        return this.targetTime
    }

    // spawnOrder() {
    //     if (!options.barLine) return 100000

    //     return 1000 + this.spawnTime
    // }

    // shouldSpawn() {
    //     return (time.scaled >= this.spawnTime) && options.barLine
    // }

    updateParallel() {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.import.timescaleGroup)

        if (scaledTime < this.visualTime.min + ((1 - options.laneLength) * note.duration)) return

        const y = approach(this.visualTime.min, this.visualTime.max, scaledTime)

        skin.sprites.simLine.draw(perspectiveLayout({ l: -5.25, r: 5.25, t: 0.99, b: 1.01 }).mul(y), 999 - this.targetTime, 1)
    }
}

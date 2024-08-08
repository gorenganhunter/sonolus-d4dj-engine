import { options } from "../../../../configuration/options.js"
import { slider } from "../../../slider.js"

export class Honoka extends SpawnableArchetype({ start: Number, startLane: Number, end: Number, endLane: Number, flick: Boolean }) {
    updated = this.entityMemory(Boolean)
    scaledTime = this.entityMemory({
        start: Number,
        end: Number
    })

    initialize() {
        if (options.mirror && !this.spawnData.flick) this.spawnData.endLane *= -1

        this.scaledTime.start = timeScaleChanges.at(this.spawnData.start).scaledTime
        this.scaledTime.end = timeScaleChanges.at(this.spawnData.end).scaledTime
    }

    spawnTime() {
        return this.spawnData.start
    }

    despawnTime() {
        return this.spawnData.end
    }

    updateSequential() {
        slider.position = Math.min(Math.max(this.spawnData.startLane, this.spawnData.endLane), Math.max(Math.min(this.spawnData.startLane, this.spawnData.endLane), Math.remap(this.scaledTime.start, this.scaledTime.end, this.spawnData.startLane, this.spawnData.endLane, time.scaled))) * 2.1

        if (this.updated || this.spawnData.flick) return

        this.updated = true

        slider.next.beat = this.spawnData.end
        slider.next.lane = this.spawnData.endLane
        slider.prev.beat = this.spawnData.start
        slider.isUsed = true
    }

    terminate() {
        this.updated = false
    }
}

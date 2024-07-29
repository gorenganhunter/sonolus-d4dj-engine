import { slider } from "../../../slider.js"

export class Honoka extends SpawnableArchetype({ start: Number, startLane: Number, end: Number, endLane: Number, flick: Boolean }) {
    updated = this.entityMemory(Boolean)

    spawnTime() {
        return this.spawnData.start
    }

    despawnTime() {
        return this.spawnData.end
    }

    updateSequential() {
        slider.position = Math.remap(this.spawnData.start, this.spawnData.end, this.spawnData.startLane, this.spawnData.endLane, time.now) * 2.1

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

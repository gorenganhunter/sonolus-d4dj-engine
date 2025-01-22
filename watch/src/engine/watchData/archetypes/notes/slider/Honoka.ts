import { options } from "../../../../configuration/options.js"
import { slider } from "../../../slider.js"
import { timeToScaledTime } from "../../timeScale.js"

export class Honoka extends SpawnableArchetype({ startBeat: Number, endBeat: Number, start: Number, startLane: Number, startTSG: Number, end: Number, endLane: Number, endTSG: Number, flick: Boolean }) {
    updated = this.entityMemory(Boolean)
    scaledTime = this.entityMemory({
        start: Number,
        end: Number
    })

    initialize() {
        if (options.mirror && !this.spawnData.flick) this.spawnData.endLane *= -1

        this.scaledTime.start = options.backspinAssist ? this.spawnData.start : timeToScaledTime(this.spawnData.start, this.spawnData.startTSG)
        this.scaledTime.end = options.backspinAssist ? this.spawnData.end : timeToScaledTime(this.spawnData.end, this.spawnData.endTSG)
    }

    spawnTime() {
        return this.spawnData.start
    }

    despawnTime() {
        return this.spawnData.end
    }

    updateSequential() {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.spawnData.startTSG)
        slider.position = (this.spawnData.flick ? Math.remap(this.spawnData.start, this.spawnData.end, this.spawnData.startLane, this.spawnData.endLane, time.now) : Math.min(Math.max(this.spawnData.startLane, this.spawnData.endLane), Math.max(Math.min(this.spawnData.startLane, this.spawnData.endLane), Math.remap(this.scaledTime.start, this.scaledTime.end, this.spawnData.startLane, this.spawnData.endLane, scaledTime)))) * 2.1

        if (this.updated || this.spawnData.flick) return

        this.updated = true

        slider.next.beat = this.spawnData.endBeat
        slider.next.lane = this.spawnData.endLane
        slider.prev.beat = this.spawnData.startBeat
        slider.isUsed = true
    }

    terminate() {
        this.updated = false
    }
}

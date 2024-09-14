import { approach, perspectiveLayout } from "../../../../../../shared/src/engine/data/utils.js"
import { note, getSpawnTime } from "../../note.js"
import { skin } from "../../skin.js"
import { archetypes } from "../index.js"
import { options } from '../../../configuration/options.js'
import { scaledTimeToEarliestTime, timeToScaledTime } from "../timeScale.js"

export class SimLine extends Archetype {
    import = this.defineImport({
        aRef: { name: "a", type: Number },
        bRef: { name: "b", type: Number }
    })

    targetTime = this.entityMemory(Number)
    spawn = this.entityMemory(Number)

    left = this.entityMemory({
        min: Number,
        max: Number,
        lane: Number,
        timescaleGroup: Number
    })

    right = this.entityMemory({
        min: Number,
        max: Number,
        lane: Number,
        timescaleGroup: Number
    })

    // spriteLayout = this.entityMemory([Quad])
    z = this.entityMemory(Number)

    preprocess() {
        if (!options.simLine) return

        this.targetTime = bpmChanges.at(this.aImport.beat).time
        // debug.log(this.targetTime)
        let l = this.aImport.lane
        let r = this.bImport.lane
        if (l > r) [l, r] = [r, l]

        if (this.aImport.lane < this.bImport.lane) {
            this.left.lane = this.aImport.lane
            this.left.timescaleGroup = this.aImport.timescaleGroup
            this.right.lane = this.bImport.lane
            this.right.timescaleGroup = this.bImport.timescaleGroup
        } else {
            this.left.lane = this.bImport.lane
            this.left.timescaleGroup = this.bImport.timescaleGroup
            this.right.lane = this.aImport.lane
            this.right.timescaleGroup = this.aImport.timescaleGroup
        }

        this.left.max = options.backspinAssist ? this.targetTime : timeToScaledTime(this.targetTime, this.left.timescaleGroup)
        this.right.max = options.backspinAssist ? this.targetTime : timeToScaledTime(this.targetTime, this.right.timescaleGroup)
        this.left.min = this.left.max - note.duration
        this.right.min = this.right.max - note.duration

        this.spawn = options.backspinAssist ? Math.min(
            this.left.min,
            this.right.min
        ) : Math.min(
            scaledTimeToEarliestTime(this.left.min, this.left.timescaleGroup),
            scaledTimeToEarliestTime(this.right.min, this.right.timescaleGroup),
        )
        // debug.log(this.spawn)
    }

    spawnTime() {
        return this.spawn
    }

    despawnTime() {
        return this.targetTime
    }

    // spawnOrder() {
    //     if (!options.simLine) return 100000

    //     return 1000 + this.spawnTime
    // }

    // shouldSpawn() {
    //     return (time.scaled >= this.spawnTime) && options.simLine
    // }

    get aImport() {
        return archetypes.DarkTapNote.import.get(this.import.aRef)
    }

    get aInfo() {
        return entityInfos.get(this.import.aRef)
    }

    get bImport() {
        return archetypes.DarkTapNote.import.get(this.import.bRef)
    }

    get bInfo() {
        return entityInfos.get(this.import.bRef)
    }

    updateParallel(): void {
        // if (time.now > this.targetTime) this.despawn = true
        // if (this.despawn) return

        this.renderConnector()
    }

    renderConnector() {
        let l = this.left.lane
        let r = this.right.lane

        const leftScaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.left.timescaleGroup)
        const rightScaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, this.right.timescaleGroup)

        if ((leftScaledTime < this.left.min + (1 - options.laneLength) * note.duration) && (rightScaledTime < this.right.min + (1 - options.laneLength) * note.duration)) return

        const y = {
            l: approach(this.left.min, this.left.max, leftScaledTime),
            r: approach(this.right.min, this.right.max, rightScaledTime)
        }

        l = l * 2.1
        r = r * 2.1

        const minY = approach(0, 1, 1 - options.laneLength)

        if (y.l < minY) {
            l = Math.remap(y.l, y.r, l, r, minY)
            y.l = minY
        } else if (y.r < minY) {
            r = Math.remap(y.l, y.r, l, r, minY)
            y.r = minY
        }

        // debug.log(y.l)
        // debug.log(y.r)

        const layout = new Quad({
            x1: l * (y.l - 0.01),
            x2: l * (y.l + 0.01),
            x3: r * (y.r + 0.01),
            x4: r * (y.r - 0.01),
            y1: y.l - 0.01,
            y2: y.l + 0.01,
            y3: y.r + 0.01,
            y4: y.r - 0.01
        })

        skin.sprites.simLine.draw(layout, 900 - this.targetTime, 1)
    }
}

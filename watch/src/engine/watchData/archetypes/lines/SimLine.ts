import { approach, perspectiveLayout } from "../../../../../../shared/src/engine/data/utils.js"
import { note, getSpawnTime } from "../../note.js"
import { skin } from "../../skin.js"
import { archetypes } from "../index.js"
import { options } from '../../../configuration/options.js'

export class SimLine extends Archetype {
    import = this.defineImport({
        aRef: { name: "a", type: Number },
        bRef: { name: "b", type: Number }
    })

    targetTime = this.entityMemory(Number)
    spawn = this.entityMemory(Number)
    visualTime = this.entityMemory({
        min: {
            l: Number,
            r: Number
        },
        max: {
            l: Number,
            r: Number
        },
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

        this.visualTime.max.l = (l === -3 || options.backspinAssist) ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime
        this.visualTime.max.r = (r === 3 || options.backspinAssist) ? this.targetTime : timeScaleChanges.at(this.targetTime).scaledTime
        this.visualTime.min.l = this.visualTime.max.l - note.duration
        this.visualTime.min.r = this.visualTime.max.r - note.duration

        this.spawn = Math.min(l === -3 || options.backspinAssist ? this.visualTime.min.l : getSpawnTime(this.targetTime), r === 3 || options.backspinAssist ? this.visualTime.min.r : getSpawnTime(this.targetTime))
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
        let l = this.aImport.lane
        let r = this.bImport.lane
        if (l > r) [l, r] = [r, l]

        if ((((l === -3 || options.backspinAssist) ? time.now : time.scaled) < this.visualTime.min.l + (1 - options.laneLength) * note.duration) && (((r === 3 || options.backspinAssist) ? time.now : time.scaled) < this.visualTime.min.r + (1 - options.laneLength) * note.duration)) return

        const y = {
            l: approach(this.visualTime.min.l, this.visualTime.max.l, (l === -3 || l === 3 || options.backspinAssist) ? time.now : time.scaled),
            r: approach(this.visualTime.min.r, this.visualTime.max.r, (r === -3 || r === 3 || options.backspinAssist) ? time.now : time.scaled)
        }

        l *= 2.1
        r *= 2.1

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
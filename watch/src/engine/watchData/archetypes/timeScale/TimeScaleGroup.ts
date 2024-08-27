import { timeToScaledTime } from '../timeScale.js'

export class TimeScaleGroup extends Archetype {
    data = this.defineImport({
        firstRef: { name: 'first', type: Number },
        length: { name: 'length', type: Number },
    })

    sharedMemory = this.defineSharedMemory({
        currentTime: Number,
        currentScaledTime: Number,
    })

    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    updateSequentialOrder = 0

    updateSequential() {
        this.sharedMemory.currentScaledTime = timeToScaledTime(time.now, this.info.index, true)
        this.sharedMemory.currentTime = time.now
    }
}

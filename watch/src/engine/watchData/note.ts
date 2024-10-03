import { baseBackspinTime } from "../../../../shared/src/engine/data/timeScale.js"
import { archetypes } from "./archetypes/index.js"

export const note = levelData({
    radius: Number,
    duration: Number
})

export const getSpawnTime = (targetTime: number) => {
    let scaledTime = timeScaleChanges.at(targetTime).scaledTime
    scaledTime -= note.duration

    let spawnTime = targetTime - note.duration

    while (timeScaleChanges.at(spawnTime).scaledTime - scaledTime > 0.00001) {
        spawnTime -= timeScaleChanges.at(spawnTime).scaledTime - scaledTime
        // debug.log(timeScaleChanges.at(spawnTime).scaledTime - scaledTime)
    }

    // debug.log(timeScaleChanges.at(spawnTime).scaledTime)
    // debug.log(scaledTime)

    return spawnTime
}

export const getBackspinTime = (baseTime: number, tsGroup: number): number =>
    baseBackspinTime(archetypes, bpmChanges, baseTime, tsGroup)

import { baseBackspinTime } from "../../../../shared/src/engine/data/timeScale.js"
import { archetypes } from "./archetypes/index.js"

export const note = levelData({
    radius: Number,
    duration: Number,
    sliderBox: Rect
})

export const getBackspinTime = (baseTime: number, tsGroup: number): number =>
    baseBackspinTime(archetypes, bpmChanges, baseTime, tsGroup)

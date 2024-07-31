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

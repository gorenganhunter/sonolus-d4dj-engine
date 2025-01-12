export class InputManager extends SpawnableArchetype({}) {
    updateSequentialOrder: number = -5
    updateSequential() {
        inputNoteIndexes.clear()
        usedTouchIdsOld.clear()
        usedTouchIds.copyTo(usedTouchIdsOld)
        usedTouchIds.clear()
        for (const touch of touches) {
            if (usedTouchIdsOld.has(touch.id) && !touch.ended) usedTouchIds.add(touch.id)
        }
        // debug.log(usedTouchIds.capacity)
    }
}

export const inputNoteIndexes = levelMemory(Collection(16, Number))
const usedTouchIds = levelMemory(Collection(16, Number))
const usedTouchIdsOld = levelMemory(Collection(16, Number))

export const isUsed = (touch: Touch) => usedTouchIds.has(touch.id)
export const markAsUsed = (touch: Touch) => usedTouchIds.add(touch.id)
export const markAsUsedId = (touchId: number) => usedTouchIds.add(touchId)
// export const unusedTouches = () => {
//     const unused: Touch[] = []
//     for (const touch of touches) {
//         if (!isUsed(touch)) unused.push(touch)
//     }
//     return unused
// }
// export const taps = () => unusedTouches().filter(touch => touch.started)

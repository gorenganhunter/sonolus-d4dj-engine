export class InputManager extends SpawnableArchetype({}) {
    updateSequentialOrder: number = -1
    updateSequential() {
        inputNoteIndexes.clear()
    }
}

export const inputNoteIndexes = levelMemory(Collection(16, Number))
const usedTouchIds = levelMemory(Collection(16, TouchId))

export const isUsed = (touch: Touch) => usedTouchIds.has(touch.id)
export const markAsUsed = (touch: Touch) => usedTouchIds.add(touch.id)
// export const unusedTouches = () => {
//     const unused: Touch[] = []
//     for (const touch of touches) {
//         if (!isUsed(touch)) unused.push(touch)
//     }
//     return unused
// }
// export const taps = () => unusedTouches().filter(touch => touch.started)

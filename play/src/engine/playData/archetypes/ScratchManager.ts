// const scratch = levelMemory({
//     now: Dictionary(16, Number, Number),
//     old: Dictionary(16, Number, Number)
// })

import { note } from "../note.js";

// const last = levelMemory({
//     dx: {
//         now: Dictionary(16, Number, Number),
//         old: Dictionary(16, Number, Number)
//     },
//     dy: {
//         now: Dictionary(16, Number, Number),
//         old: Dictionary(16, Number, Number)
//     },
// })


// const minScratchV = 0.05 * screen.w
const minScratchVr = 4

export class ScratchManager extends SpawnableArchetype({}) {
    // touch() {
    //     claimed.clear()
    // }

    // updateSequential() {
    //     for (const touch of touches) {
    //         const id = claimed.indexOf(touch.id)

    //         if (id === -1) continue

    //         const { position: pos, dx, dy, vr } = touch
    //         // if (touch.vr < 1) claimed.set(touch.id, { pos, dx, dy, vr, isUsed: false })
    //         // else claimed.set(touch.id, { pos, dx, dy, vr, isUsed: true })
    //     }
    // }
    // updateSequential(): void {
    //     claimed.clear()

    //     scratch.old.clear()
    //     scratch.now.copyTo(scratch.old)
    //     scratch.now.clear()

    //     last.dx.old.clear()
    //     last.dy.old.clear()
    //     last.dx.now.copyTo(last.dx.old)
    //     last.dy.now.copyTo(last.dy.old)
    //     last.dx.now.clear()
    //     last.dy.now.clear()

    //     for (const touch of touches) {
    //         const id = scratch.old.indexOf(touch.id)
    //         last.dx.now.set(touch.id, touch.dx)
    //         last.dy.now.set(touch.id, touch.dy)

    //         if(id === -1) continue

    //         const lastdxIndex = last.dx.old.indexOf(touch.id)
    //         const lastdxValue = lastdxIndex === -1 ? 0 : last.dx.old.getValue(lastdxIndex)
    //         const lastdyValue = lastdxIndex === -1 ? 0 : last.dy.old.getValue(lastdxIndex)

    //         if (calcV(touch) < minScratchV) {
    //             last.dx.now.set(touch.id, lastdxValue)
    //             last.dy.now.set(touch.id, lastdyValue)
    //             scratch.now.set(touch.id, 1)

    //             continue
    //         }

    //         const dotmul = lastdxValue * touch.dx + lastdyValue * touch.dy
    //         if (dotmul <= 0) continue
    //         
    //         scratch.now.set(touch.id, 1)
    //     }
    // }
}

// const getAngle = (dx: number, dy: number) => {
//     const temp = Math.atan(dy/dx) / (Math.PI / 180)
//     return dx < 0 ? 180 - temp : temp
// }

const vectorAngle = (x: number[], y: number[]) => Math.acos( x.reduce((acc, n, i) => acc + n * y[i], 0) / (Math.hypot(...x) * Math.hypot(...y)) );

const claimed = levelMemory(Dictionary(16, TouchId, { pos: Vec, dx: Number, dy: Number , vr: Number , isUsed: Boolean, t: Number }))

export const startClaim = (touch: Touch) => {
    claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: false, t: time.now })
}

export const claim = (touch: Touch) => {
    claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: true, t: time.now })
}

export const isClaimed = (touch: Touch): boolean => {
//    debug.log(touch.id)
    
    const id = claimed.indexOf(touch.id)
// debug.log(id)
    if (id === -1) return false
    
    const old = claimed.getValue(id)
    // if (!old.isUsed) return false

    const v = touch.position.sub(old.pos).length
//    debug.log(v)
    if (v < 0.1 * screen.w * note.scratch.movement) return true
    // if ((v || 0) < minScratchV) return true

    if (touch.vr < minScratchVr) return true
    // 
    if (old.isUsed && time.now - old.t < note.scratch.distance) return true

    // const { position: pos, dx, dy, vr } = touch
    // claimed.set(touch.id, { pos, dx, dy, vr, isUsed: true })
// debug.log(touch.vr)
    return old.isUsed ? vectorAngle([touch.dx, touch.dy], [old.dx, old.dy]) / (Math.PI / 180) < note.scratch.angle : false
}

// export const isUsed = (touch: Touch) => usedTouchIds.has(touch.id)
// export const markAsUsed = (touch: Touch) => usedTouchIds.add(touch.id)

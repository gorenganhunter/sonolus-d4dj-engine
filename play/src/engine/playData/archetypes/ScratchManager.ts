import { note } from "../note.js";
import { inputNoteIndexes, isUsed, markAsUsedId } from "./InputManager.js";
import { archetypes } from "./index.js";

const flickDisallowEmptiesNow = levelMemory(Dictionary(16, Number, Number))
const flickDisallowEmptiesOld = levelMemory(Dictionary(16, Number, Number))
const lastdx = levelMemory(Dictionary(16, Number, Number))
const lastdy = levelMemory(Dictionary(16, Number, Number))
const lastTime = levelMemory(Dictionary(16, Number, Number))
const lastdxOld = levelMemory(Dictionary(16, Number, Number))
const lastdyOld = levelMemory(Dictionary(16, Number, Number))

export const scratchTouches = levelMemory(Collection(16, Number))
const scratchTouchesOld = levelMemory(Collection(16, Number))
levelMemory(Tuple(16, Number))

const minFlickV = 0.2

// const calcV = (touch: Touch) => ((touch.dx * touch.dx + touch.dy * touch.dy) ** 0.5) / time.delta

export class ScratchManager extends SpawnableArchetype({}) {
    // touch() {
    //     claimed.clear()
    // }

    updateSequentialOrder = -3
    updateSequential(): void {
        claimed.clear()
        //debug.log(7777)

        scratchTouchesOld.clear()
        scratchTouches.copyTo(scratchTouchesOld)
        scratchTouches.clear()
        for (const touch of touches) {
            if (scratchTouchesOld.has(touch.id) && !touch.ended) scratchTouches.add(touch.id)
        }

        flickDisallowEmptiesOld.clear()
        flickDisallowEmptiesNow.copyTo(flickDisallowEmptiesOld)
        flickDisallowEmptiesNow.clear()

        lastdxOld.clear()
        lastdyOld.clear()
        lastdx.copyTo(lastdxOld)
        lastdy.copyTo(lastdyOld)
        lastdx.clear()
        lastdy.clear()

        for (const touch of touches) {
            const id = flickDisallowEmptiesOld.indexOf(touch.id)
            lastdx.set(touch.id, touch.dx)
            lastdy.set(touch.id, touch.dy)

            if (id === -1) continue

            const lastdxIndex = lastdxOld.indexOf(touch.id)
            const lastdxValue = lastdxIndex === -1 ? 0 : lastdxOld.getValue(lastdxIndex)
            const lastdyValue = lastdxIndex === -1 ? 0 : lastdyOld.getValue(lastdxIndex)

            const lastTimeIndex = lastTime.indexOf(touch.id)
            const lastTimeValue = lastTimeIndex === -1 ? -9999 : lastTime.getValue(lastTimeIndex)

            if (isUsed(touch) && !scratchTouches.has(touch.id)) continue

            if (calcV(touch) < minFlickV * note.scratch.movement/* || time.now - lastTimeValue < note.scratch.distance*/) {
                lastdx.set(touch.id, lastdxValue)
                lastdy.set(touch.id, lastdyValue)
                flickDisallowEmptiesNow.set(touch.id, 1)

                continue
            }

            const angle = vectorAngle([touch.dx, touch.dy], [lastdxValue, lastdyValue]) / (Math.PI / 180)
            if (angle > note.scratch.angle) continue

            flickDisallowEmptiesNow.set(touch.id, 1)
        }
    }
}

function getHitbox(index: number) {
    let hitbox: Rect = archetypes.ScratchNote.hitbox.get(index)
    let noteImport = archetypes.ScratchNote.import.get(index)
    const mid = (hitbox.l + hitbox.r) / 2
    for (const otherIndex of inputNoteIndexes) {
        if (otherIndex === index) continue
        const otherImport = archetypes.ScratchNote.import.get(otherIndex)
        const otherInfo = entityInfos.get(otherIndex)

        if (otherInfo.state === EntityState.Despawned || otherImport.beat !== noteImport.beat) continue

        const otherHitbox = archetypes.ScratchNote.hitbox.get(otherIndex)
        const otherMid = (otherHitbox.l + otherHitbox.r) / 2

        if (otherMid > mid && hitbox.r > otherHitbox.l) hitbox.r = (hitbox.r + otherHitbox.l) / 2
        else if (otherMid < mid && hitbox.l < otherHitbox.r) hitbox.l = (hitbox.l + otherHitbox.r) / 2
    }
    // debug.log(mid)
    return hitbox
}
// class ClaimInfo {
//     public cx: number
//     public cy: number
//     public time: number
//     
//     function getDis(x: number, y: number) {
//         IF (rotate == PI / 2 || rotate == PI / 2 * 3) {
//             Return(Abs(x - cx));
//         } FI
//         let k = Tan(rotate), b = cy - k * cx;
//         let dis = Abs(-1 * k * x + y - b) / Power({k * k + 1, 0.5});
//         Return(dis);
//         return VAR;
//     }
//     function contain(x: number, y: number) {
//         FUNCBEGIN
//         Return(getDis(x, y) <= judgeDistanceLimit);
//         return VAR;
//     }
// };

function getInfo(index: number) {
    const noteImport = archetypes.ScratchNote.import.get(index);
    return {
        hitbox: getHitbox(index),
        time: bpmChanges.at(noteImport.beat)
    };
}

function findBestTouchIndex(index: number) {
    const origin = getInfo(index);
    let res = -1
    for (const touch of touches) {
        // debug.log(touch.vr)
        if (calcV(touch) < minFlickV * note.scratch.movement) continue
        const id = flickDisallowEmptiesNow.indexOf(touch.id);
        if (id != -1) continue
        if (!origin.hitbox.contains(touch.position)) continue
        if (!origin.hitbox.contains(touch.startPosition)) continue

        // let dis = Math.min(
        //     origin.getDis(touch.x, touch.y),
        //     origin.getDis(touch.x - touch.dx, touch.y - touch.dy)
        // );
        // if (res != -1 && minDis <= dis) continue

        let claimIndex = claimed.indexOf(touch.id);
        if (claimIndex == -1) {
            res = touch.id
            continue
        }

        const claim = getInfo(claimed.getValue(claimIndex));
        if (origin.time > claim.time) continue
        if (origin.time < claim.time) {
            res = touch.id
            continue
        }

        // if (dis > Math.min(
        //     claim.getDis(touch.x, touch.y),
        //     claim.getDis(touch.x - touch.dx, touch.y - touch.dy)
        // )) continue
        if (index > claimed.getValue(claimIndex)) continue // nmd 如果 time 和 dis 完全相等的话会导致一直 claim，然后 Sonolus 死机
        // mlgb 老子在这里调了 6 个小时结果是 nm 这个问题
        res = touch.id;
    }
    return res;
}

function claim(index: number) {
    let currentId = index;
    // const info = getInfo(currentId);
    while (true) {
        let touchIndex = findBestTouchIndex(currentId);
        //        debug.log(touchIndex)
        if (touchIndex == -1) break
        flickDisallowEmptiesNow.set(touchIndex, 1);
        let claimIndex = claimed.indexOf(touchIndex);
        if (claimIndex == -1) {
            claimed.set(touchIndex, currentId);
            lastTime.set(touchIndex, time.now);
            break
        }

        let tmp = currentId;
        currentId = claimed.getValue(claimIndex);
        claimed.set(touchIndex, tmp);
    }
}

function findBestTouchIndexEmpty() {
    // const origin = getInfo(index);
    let res = -1
    for (const touch of touches) {
        // debug.log(touch.vr)
        if (calcV(touch) < minFlickV * note.scratch.movement || isUsed(touch)) continue
        const id = flickDisallowEmptiesNow.indexOf(touch.id);
        if (id != -1) continue
        if (!(note.scratch.hitbox.left.contains(touch.startPosition) && note.scratch.hitbox.left.contains(touch.position)) && !(note.scratch.hitbox.right.contains(touch.startPosition) && note.scratch.hitbox.right.contains(touch.position))) continue

        // let dis = Math.min(
        //     origin.getDis(touch.x, touch.y),
        //     origin.getDis(touch.x - touch.dx, touch.y - touch.dy)
        // );
        // if (res != -1 && minDis <= dis) continue

        let claimIndex = claimed.indexOf(touch.id);
        if (claimIndex == -1) {
            res = touch.id
            continue
        }

        //    const claim = getInfo(claimed.getValue(claimIndex));
        //    if (origin.time > claim.time) continue
        //    if (origin.time < claim.time) {
        //        res = touch.id
        //        continue
        //    }
        // 
        //    // if (dis > Math.min(
        //    //     claim.getDis(touch.x, touch.y),
        //    //     claim.getDis(touch.x - touch.dx, touch.y - touch.dy)
        //    // )) continue
        //    if (index > claimed.getValue(claimIndex)) continue // nmd 如果 time 和 dis 完全相等的话会导致一直 claim，然后 Sonolus 死机
        //    // mlgb 老子在这里调了 6 个小时结果是 nm 这个问题
        //    res = touch.id;
    }
    return res;
}

function calcV(touch: Touch): number {
    return Math.sqrt(touch.dx ** 2 + touch.dy ** 2) / time.delta
}

function claimEmpty() {
    // let currentId = index;
    // const info = getInfo(currentId);
    let touchIndex = findBestTouchIndexEmpty();
    //    debug.log(touchIndex)
    if (touchIndex == -1) return
    flickDisallowEmptiesNow.set(touchIndex, 1);
    let claimIndex = claimed.indexOf(touchIndex);
    if (claimIndex == -1) {
        claimed.set(touchIndex, -1);
        lastTime.set(touchIndex, time.now)
    }

    //let tmp = currentId;
    //currentId = claimed.getValue(claimIndex);
    //claimed.set(touchIndex, tmp);
}

function getClaimedTouchIndex(index: number) {
    for (let i = 0; i < claimed.count; i++) {
        if (claimed.getValue(i) == index) {
            const id = claimed.getKey(i)
            markAsUsedId(id)
            scratchTouches.add(id)
            return id;
        }
    }
    return -1;
}

export const flickClaimStart = (index: number) => claim(index)
export const flickGetClaimedStart = (index: number) => getClaimedTouchIndex(index)

export const flickClaimStartEmpty = () => claimEmpty()
// export const flickGetClaimedStartEmpty = () => {
//     for (let i = 0; i < claimed.count; i++) {
//         if (claimed.getValue(i) == -1) {
//             claimed.getKey(i);
//         }
//     }
// }

// const getAngle = (dx: number, dy: number) => {
//     const temp = Math.atan(dy/dx) / (Math.PI / 180)
//     return dx < 0 ? 180 - temp : temp
// }

const vectorAngle = (x: number[], y: number[]) => Math.acos(x.reduce((acc, n, i) => acc + n * y[i], 0) / (Math.hypot(...x) * Math.hypot(...y)));

export const claimed = levelMemory(Dictionary(16, Number, Number))

// const claimed = levelMemory(Dictionary(16, TouchId, { pos: Vec, dx: Number, dy: Number , vr: Number , isUsed: Boolean, t: Number }))

// export const startClaim = (touch: Touch) => {
//     claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: false, t: time.now })
// }

// export const claim = (touch: Touch) => {
//     claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: true, t: time.now })
// }
// export const isClaimed = (touch: Touch) => {
//     debug.log(claimed.count)
//     debug.log(9999)
//     for (let i = 0; i < claimed.count; i++) {
//         debug.log(claimed.getKey(i))
//         debug.log(claimed.getValue(i))
//     }
//     debug.log(9999)
//     return claimed.has(touch.id)
// }
// export const isClaimed = (touch: Touch): boolean => {
// //    debug.log(touch.id)
//     
//     const id = claimed.indexOf(touch.id)
// // debug.log(id)
//     if (id === -1) return false
//     
//     const old = claimed.getValue(id)
//     // if (!old.isUsed) return false

//     const v = touch.position.sub(old.pos).length
// //    debug.log(v)
//     if (v < 0.2 * note.scratch.movement) return true
//     // if ((v || 0) < minScratchV) return true

//     if (touch.vr < minScratchVr) return true
//     // 
//     if (old.isUsed && time.now - old.t < note.scratch.distance) return true

//     // const { position: pos, dx, dy, vr } = touch
//     // claimed.set(touch.id, { pos, dx, dy, vr, isUsed: true })
// // debug.log(touch.vr)
//     return old.isUsed ? vectorAngle([touch.dx, touch.dy], [old.dx, old.dy]) / (Math.PI / 180) < note.scratch.angle : false
// }

// export const isUsed = (touch: Touch) => usedTouchIds.has(touch.id)
// export const markAsUsed = (touch: Touch) => usedTouchIds.add(touch.id)

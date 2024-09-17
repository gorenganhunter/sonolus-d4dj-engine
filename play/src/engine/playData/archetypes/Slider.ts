import { approach, leftRotated, perspectiveLayout } from "../../../../../shared/src/engine/data/utils.js";
import { note } from "../note.js";
import { skin } from "../skin.js";
import { slider } from "../slider.js";
import { isUsed, markAsUsed } from "./InputManager.js";
import { options } from '../../configuration/options.js'
import { isClaimed as isScratchClaimed } from "./ScratchManager.js"
import { timeToScaledTime } from "./utils.js";

// export class Slider extends SpawnableArchetype({}) {
//     sliderBox = this.entityMemory(Rect)

//     touchOrder = 2
//     hasInput = true

//     next = this.entityMemory({
//         time: Number,
//         scaledTime: Number
//     })

//     sprites = this.entityMemory({
//         slider: SkinSpriteId,
//         sliderBar: SkinSpriteId
//     })

//     touch() {
//         for (const touch of touches) {
//             if ((isUsed(touch) || isScratchClaimed(touch)) && (slider.touch !== touch.id)) continue
// // debug.log(isUsed(touch))
//             
//             if ((slider.touch !== touch.id) && !this.sliderBox.contains(touch.startPosition) && !(slider.isUsed && new Rect({ l: slider.position - 1.05, r: slider.position + 1.05, t: 0, b: 1 + note.radius * 4 }).transform(skin.transform).contains(touch.startPosition))) continue

//             slider.touch = touch.id
//             
//             const tch = touch.x / screen.h * 10.75 / options.width / (1 + note.radius * 4)
//             const sliderPos = (tch > 4.2) ? 4.2 : (tch < -4.2) ? -4.2 : tch
//             
//             if (!touch.ended) skin.sprites.sliderConnector.draw(perspectiveLayout({ l: sliderPos - 1.05, r: sliderPos + 1.05, b: 1 + note.radius, t: 1 - note.radius * 8 }), 101, 0.5)

//             // debug.log(sliderPos)
//             slider.position = sliderPos

//             if (!isUsed(touch)) markAsUsed(touch)
//             return
//         }
//     }

//     updateParallel() {
//         skin.sprites.draw(this.sprites.sliderBar, perspectiveLayout({ l: -4.2, r: 4.2, b: 1 + note.radius * 3.9, t: 0.99 + note.radius * 3.9 }), 3, 1)
//         skin.sprites.draw(this.sprites.slider, perspectiveLayout({ l: slider.position - 0.35, r: slider.position + 0.35, b: 1.075 + note.radius * 3.9, t: 0.925 + note.radius * 3.9 }), 4, 1)
//         if(slider.isUsed) this.renderSlider()
//     }

//     updateSequential() {
//         if (/*(!slider.touch || touches.get(slider.touch).ended) &&*/ !slider.isUsed) {
//             slider.position = slider.next.lane * 2.1
//             // debug.log(slider.position)
//         }
//     }

//     renderSlider() {
//         skin.sprites.sliderNote.draw(perspectiveLayout({ l: slider.position - 0.5, r: slider.position + 0.5, b: 0.95 + note.radius * 4, t: 1 - note.radius * 2 }), 105, 1)
//         this.renderConnector()
//     }

//     initialize() {
//         this.sprites.slider = skin.sprites.slider.exists ? skin.sprites.slider.id : skin.sprites.sliderFallback.id
//         this.sprites.sliderBar = skin.sprites.sliderBar.exists ? skin.sprites.sliderBar.id : skin.sprites.sliderBarFallback.id
//         new Rect({ l: -6.3, r: 6.3, b: 1.1 + note.radius * 4, t: 0.9 + note.radius * 4 }).transform(skin.transform).copyTo(this.sliderBox)
//     }

//     renderConnector() {
//         // if (options.hidden > 0 && time.now > this.visualTime.hidden) return
//         const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
//         
//         this.next.time = bpmChanges.at(slider.next.beat).time
//         this.next.scaledTime = options.backspinAssist ? this.next.time : timeToScaledTime(this.next.time, slider.next.timescaleGroup)

//         const hiddenDuration = 0

//         const visibleTime = {
//             min: Math.max(/* (this.headImport.lane === (3 || -3)) ? */ scaledTime /* : timeScaleChanges.at(this.head.time).scaledTime */, scaledTime + hiddenDuration),
//             max: Math.min(/* (this.headImport.lane === (3 || -3)) ? */ this.next.scaledTime  /* : timeScaleChanges.at(this.tail.time).scaledTime */, scaledTime + note.duration * options.laneLength),
//         }

//         const l = {
//             min: this.getL(visibleTime.min),
//             max: this.getL(visibleTime.max),
//         }

//         const r = {
//             min: this.getR(visibleTime.min),
//             max: this.getR(visibleTime.max),
//         }

//         const y = {
//             min: approach(visibleTime.min - note.duration, visibleTime.min, scaledTime),
//             max: approach(visibleTime.max - note.duration, visibleTime.max, scaledTime),
//         }

//         const layout = {
//             x1: l.min * y.min,
//             x2: l.max * y.max,
//             x3: r.max * y.max,
//             x4: r.min * y.min,
//             y1: y.min,
//             y2: y.max,
//             y3: y.max,
//             y4: y.min,
//         }

//         skin.sprites.sliderConnector.draw(layout, 90, options.connectorAlpha)
//     }

//     getLane(time2: number) {
//         const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
//         return Math.remap(scaledTime, this.next.scaledTime, slider.position, slider.next.lane * 2.1, time2)
//     }

//     getL(time2: number) {
//         const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
//         return Math.remap(scaledTime, this.next.scaledTime, slider.position - (0.125 * options.noteSize), slider.next.lane * 2.1 - (0.125 * options.noteSize), time2)
//     }

//     getR(time2: number) {
//         const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
//         return Math.remap(scaledTime, this.next.scaledTime, slider.position + (0.125 * options.noteSize), slider.next.lane * 2.1 + (0.125 * options.noteSize), time2)
//     }
// }

const vectorAngle = (x: number[], y: number[]) => Math.acos( x.reduce((acc, n, i) => acc + n * y[i], 0) / (Math.hypot(...x) * Math.hypot(...y)) );

const minSliderFlickDistance = 0.1
const minSliderFlickVr = 2

const claimed = levelMemory(Dictionary(16, TouchId, { pos: Vec, dx: Number, dy: Number , vr: Number , isUsed: Boolean, t: Number }))

export const startClaim = (touch: Touch) => {
    claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: false, t: touch.t })
}

export const claim = (touch: Touch) => {
    claimed.set(touch.id, { pos: touch.position, dx: touch.dx, dy: touch.dy, vr: touch.vr, isUsed: true, t: touch.t })
}

export const isClaimed = (touch: Touch) => {
    const id = claimed.indexOf(touch.id)
    
    if (id === -1) return false

    const old = claimed.getValue(id)

    const v = touch.position.sub(old.pos).length
//    debug.log(v)
    if (v < 0.02 * screen.w) return true
    // if ((v || 0) < minScratchV) return true

    if (touch.vr < minSliderFlickVr) return true

    if (old.isUsed && touch.t - old.t < minSliderFlickDistance) return true
    
    return old.isUsed ? vectorAngle([touch.dx, touch.dy], [old.dx, old.dy]) / (Math.PI / 180) < 90 : false
}

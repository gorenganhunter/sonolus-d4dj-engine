import { approach, leftRotated, perspectiveLayout } from "../../../../../shared/src/engine/data/utils.js";
import { note } from "../note.js";
import { skin } from "../skin.js";
import { slider } from "../slider.js";
import { isUsed, markAsUsed } from "./InputManager.js";
import { archetypes } from "./index.js";
import { SliderNote } from "./notes/slider/SliderNote.js";

export class Slider extends SpawnableArchetype({}) {
    sliderBox = this.entityMemory(Rect)

    touchOrder = 2
    hasInput = true

    next = this.entityMemory({
        time: Number,
        scaledTime: Number
    })

    touch() {
        for (const touch of touches) {
            if (isUsed(touch) && (slider.touch !== touch.id)) continue
// debug.log(isUsed(touch))
            if (!this.sliderBox.contains(touch.startPosition) && !(slider.isUsed && new Rect({ l: slider.position - 1.05, r: slider.position + 1.05, t: 1 - note.radius * 2, b: 1 + note.radius * 4 }).transform(skin.transform).contains(touch.startPosition))) continue

            slider.touch = touch.id
            
            const tch = touch.x / screen.w * 22.3
            const sliderPos = (tch > 4.2) ? 4.2 : (tch < -4.2) ? -4.2 : tch
            
            if (!touch.ended) skin.sprites.sliderConnector.draw(perspectiveLayout({ l: sliderPos - 1.05, r: sliderPos + 1.05, b: 1 + note.radius, t: 1 - note.radius * 8 }), 101, 0.5)

            // debug.log(sliderPos)
            slider.position = sliderPos

            if (isUsed(touch)) markAsUsed(touch)
            return
        }
    }

    updateParallel() {
        skin.sprites.sliderBar.draw(perspectiveLayout({ l: -4.2, r: 4.2, b: 1 + note.radius * 3.9, t: 0.99 + note.radius * 3.9 }), 3, 1)
        skin.sprites.slider.draw(perspectiveLayout({ l: slider.position - 0.35, r: slider.position + 0.35, b: 1.075 + note.radius * 3.9, t: 0.925 + note.radius * 3.9 }), 4, 1)
        if(slider.isUsed) this.renderSlider()
    }

    updateSequential() {
        if (/*(!slider.touch || touches.get(slider.touch).ended) &&*/ !slider.isUsed) {
            slider.position = slider.next.lane * 2.1
            // debug.log(slider.position)
        }
    }

    renderSlider() {
        // const visibleTimeMax = Math.min(timeScaleChanges.at(slider.next.beat).scaledTime, time.scaled + note.duration)
        // debug.log(visibleTimeMax)
        // const y = approach(visibleTimeMax - note.duration, visibleTimeMax, time.scaled)
        // const nextPos = new Vec({ x: slider.next.lane * 24 / 100, y })
        // const layout = new Quad({
        //     p1: new Vec({ x: slider.position - 0.025, y: 1 }),
        //     p2: new Vec({ x: slider.position + 0.025, y: 1 }),
        //     p3: nextPos.translate(0.025, 0),
        //     p4: nextPos.translate(-0.025, 0)
        // })
        skin.sprites.sliderNote.draw(perspectiveLayout({ l: slider.position - 0.5, r: slider.position + 0.5, b: 0.95 + note.radius * 4, t: 1 - note.radius * 2 }), 105, 1)
        this.renderConnector()
        // skin.sprites.sliderConnector.draw(layout, 104, 1)
    }

    spawnOrder() {
        return 2
    }
    
    shouldSpawn() {
        return entityInfos.get(0).state === EntityState.Despawned
    }

    initialize() {
        new Rect({ l: -6.3, r: 6.3, b: 1.1 + note.radius * 4, t: 0.9 + note.radius * 4 }).transform(skin.transform).copyTo(this.sliderBox)
    }

    preprocess() {
        slider.next.beat = 999999
        slider.isUsed = false
    }
    
    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return
        this.next.time = bpmChanges.at(slider.next.beat).time
        this.next.scaledTime = timeScaleChanges.at(this.next.time).scaledTime
        const hiddenDuration = 0

        const visibleTime = {
            min: Math.max(/* (this.headImport.lane === (3 || -3)) ? */ time.scaled /* : timeScaleChanges.at(this.head.time).scaledTime */, time.scaled + hiddenDuration),
            max: Math.min(/* (this.headImport.lane === (3 || -3)) ? */this.next.scaledTime  /* : timeScaleChanges.at(this.tail.time).scaledTime */, time.scaled + note.duration),
        }

        const l = {
            min: this.getL(visibleTime.min),
            max: this.getL(visibleTime.max),
        }

        const r = {
            min: this.getR(visibleTime.min),
            max: this.getR(visibleTime.max),
        }

        const y = {
            min: approach(visibleTime.min - note.duration, visibleTime.min, time.scaled),
            max: approach(visibleTime.max - note.duration, visibleTime.max, time.scaled),
        }

        const layout = {
            x1: l.min * y.min,
            x2: l.max * y.max,
            x3: r.max * y.max,
            x4: r.min * y.min,
            y1: y.min,
            y2: y.max,
            y3: y.max,
            y4: y.min,
        }

        skin.sprites.sliderConnector.draw(layout, 104, 1)
    }

    getLane(time2: number) {
        return Math.remap(time.scaled, this.next.scaledTime, slider.position, slider.next.lane * 2.1, time2)
    }

    getL(time2: number) {
        return Math.remap(time.scaled, this.next.scaledTime, slider.position - 0.2, slider.next.lane * 2.1 - 0.2, time2)
    }

    getR(time2: number) {
        return Math.remap(time.scaled, this.next.scaledTime, slider.position + 0.2, slider.next.lane * 2.1 + 0.2, time2)
    }
}

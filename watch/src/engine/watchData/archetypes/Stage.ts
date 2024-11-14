import { approach, perspectiveLayout, diskLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { skin } from '../skin.js'
import { archetypes } from './index.js'
import { slider } from "../slider.js";
import { timeToScaledTime } from './timeScale.js'
import { scaledScreen } from '../scaledScreen.js'

export class Stage extends Archetype {
    data = this.defineImport({
        discTsgL: { name: "discTsgL", type: Number },
        discTsgR: { name: "discTsgR", type: Number }
    })

    next = this.entityMemory({
        time: Number,
        scaledTime: Number
    })

    sprites = this.entityMemory({
        splitLine: SkinSpriteId,
        borderRight: SkinSpriteId,
        borderLeft: SkinSpriteId,
        slider: SkinSpriteId,
        sliderBar: SkinSpriteId
    })
    
    get useFallbackStage() {
        return !skin.sprites.djStage.exists
    }

    spawnTime() {
        return -999999
    }

    despawnTime() {
        return 999999
    }

    preprocess() {
        this.sprites.splitLine = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.splitLine.id
        this.sprites.borderRight = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.borderRight.id
        this.sprites.borderLeft = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.borderLeft.id
        this.sprites.slider = skin.sprites.slider.exists ? skin.sprites.slider.id : skin.sprites.sliderFallback.id
        this.sprites.sliderBar = skin.sprites.sliderBar.exists ? skin.sprites.sliderBar.id : skin.sprites.sliderBarFallback.id
    }

    updateParallel() {
        // debug.log(time.scaled)
        
        const hidden = approach(0, 1, 1 - options.laneLength)

        const t = 0 + hidden
        const b = 1

        skin.sprites.draw(this.sprites.borderRight, perspectiveLayout({ l: 7.35, r: 7.5, b, t }), 2, options.lineOpacity)
        skin.sprites.draw(this.sprites.borderLeft, perspectiveLayout({ l: -7.5, r: -7.35, b, t }), 2, options.lineOpacity)
        skin.sprites.borderBottom.draw(perspectiveLayout({ l: options.disk ? -6.3 : -7.35, r: options.disk ? 6.3 : 7.35, b: 1.01, t: 0.99 }), 7, 1)

        for (let i = -3; i <= 3; i++) {
            if (i < 3) skin.sprites.draw(
                this.sprites.splitLine,
                perspectiveLayout({ l: i * 2.1 + 1.05 - 0.08, r: i * 2.1 + 1.05 + 0.08, b, t }),
                2,
                options.lineOpacity,
            )

            if (this.useFallbackStage) {
                if ((i === -3 || i === 3) && skin.sprites.laneAlt.exists) skin.sprites.laneAlt.draw(
                    perspectiveLayout({ l: i * 2.1 - 1.05, r: i * 2.1 + 1.05, b, t }),
                    0,
                    options.opacity,
                )
                else skin.sprites.lane.draw(
                    perspectiveLayout({ l: i * 2.1 - 1.05, r: i * 2.1 + 1.05, b, t }),
                    0,
                    options.opacity,
                )
            }

            skin.sprites.slot.draw(
                perspectiveLayout({ l: i * 2.1 - 0.25, r: i * 2.1 + 0.25, b: 1.02, t: 0.98 }),
                8,
                1,
            )
        }

        skin.sprites.judgeLine.draw(
            perspectiveLayout({ l: -7.35, r: 7.35, b: 1 + note.radius, t: 1 - note.radius }),
            6,
            0.7,
        )

        if (!this.useFallbackStage) skin.sprites.djStage.draw(perspectiveLayout({ l: -7.35, r: 7.35, b, t }), 0, options.opacity)
        
        skin.sprites.draw(this.sprites.sliderBar, perspectiveLayout({ l: -4.2, r: 4.2, b: 1 + note.radius * 3.9, t: 0.99 + note.radius * 3.9 }), 8, 1)
        skin.sprites.draw(this.sprites.slider, perspectiveLayout({ l: slider.position - 0.35, r: slider.position + 0.35, b: 1.075 + note.radius * 3.9, t: 0.925 + note.radius * 3.9 }), 9, 1)
        
        if(slider.isUsed) this.renderSlider()

        this.renderDisk()
    }

    updateSequential() {
        if (bpmChanges.at(slider.next.beat).time < time.now || bpmChanges.at(slider.prev.beat).time > time.now) slider.isUsed = false
    }
    
    renderDisk() {
        if (options.disk) {
            this.renderLeftDisk()
            this.renderRightDisk()
        }
    }


    renderLeftDisk() {
        const dw = 3.9
        const dh = dw * scaledScreen.wToH * 0.75

        let dt = timeToScaledTime(time.now, this.data.discTsgL)
        dt %= 2

        const origin = new Vec({
            x: -8.8,
            y: 1
        })

        const angle = Math.PI * dt

        skin.sprites.turntableBase.draw(diskLayout(origin, dw, dh, 0), 3, 1)
        skin.sprites.diskOutside.draw(diskLayout(origin, dw, dh, angle), 4, 1)
        skin.sprites.diskInside.draw(diskLayout(origin, dw / 3, dh / 3, angle), 5, 1)
    }

    renderRightDisk() {
        const dw = 3.9
        const dh = dw * scaledScreen.wToH * 0.75

        let dt = timeToScaledTime(time.now, this.data.discTsgR)
        dt %= 2

        const origin = new Vec({
            x: 8.8,
            y: 1
        })

        const angle = Math.PI * dt

        skin.sprites.turntableBase.draw(diskLayout(origin, dw, dh, 0), 3, 1)
        skin.sprites.diskOutside.draw(diskLayout(origin, dw, dh, angle), 4, 1)
        skin.sprites.diskInside.draw(diskLayout(origin, dw / 3, dh / 3, angle), 5, 1)
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

    // preprocess() {
    //     slider.next.beat = 999999
    //     slider.isUsed = false
    //     slider.next.lane = -2
    // }
    
    renderConnector() {
        // if (options.hidden > 0 && time.now > this.visualTime.hidden) return
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        
        this.next.time = bpmChanges.at(slider.next.beat).time
        this.next.scaledTime = options.backspinAssist ? this.next.time : timeToScaledTime(this.next.time, slider.next.timescaleGroup)

        const hiddenDuration = 0

        const visibleTime = {
            min: Math.max(/* (this.headImport.lane === (3 || -3)) ? */ scaledTime /* : timeScaleChanges.at(this.head.time).scaledTime */, scaledTime + hiddenDuration),
            max: Math.min(/* (this.headImport.lane === (3 || -3)) ? */ this.next.scaledTime  /* : timeScaleChanges.at(this.tail.time).scaledTime */, scaledTime + note.duration * options.laneLength),
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
            min: approach(visibleTime.min - note.duration, visibleTime.min, scaledTime),
            max: approach(visibleTime.max - note.duration, visibleTime.max, scaledTime),
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

        skin.sprites.sliderConnector.draw(layout, 90, options.connectorAlpha)
    }

    getLane(time2: number) {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        return Math.remap(scaledTime, this.next.scaledTime, slider.position, slider.next.lane * 2.1, time2)
    }

    getL(time2: number) {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        return Math.remap(scaledTime, this.next.scaledTime, slider.position - (0.125 * options.noteSize), slider.next.lane * 2.1 - (0.125 * options.noteSize), time2)
    }

    getR(time2: number) {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        return Math.remap(scaledTime, this.next.scaledTime, slider.position + (0.125 * options.noteSize), slider.next.lane * 2.1 + (0.125 * options.noteSize), time2)
    }
}

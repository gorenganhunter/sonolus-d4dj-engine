import { approach, perspectiveLayout, diskLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { particle, circularEffectLayout } from '../particle.js'
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

        if (options.mirror) {
            const temp = this.data.discTsgL
            this.data.discTsgL = this.data.discTsgR
            this.data.discTsgR = temp
        }

        this.renderDisk()

        if (!options.sfxEnabled) return

        for (let lane = -3; lane <= 3; lane++) {
            let key = -9999

            while (true) {
                const newKey = streams.getNextKey(lane + 100, key)

                if (key === newKey) break;

                if (lane === -3 || lane === 3) effect.clips.scratchEmpty.schedule(newKey, 0.02)
                else effect.clips.tapEmpty.schedule(newKey, 0.02)

                key = newKey
            }
        }
    }

    updateParallel() {
        // debug.log(time.scaled)

        const hidden = approach(0, 1, 1 - options.laneLength)

        const t = 0 + hidden
        const b = 1

        skin.sprites.draw(this.sprites.borderRight, perspectiveLayout({ l: 7.35, r: 7.55, b, t }), 2, options.lineOpacity)
        skin.sprites.draw(this.sprites.borderLeft, perspectiveLayout({ l: -7.55, r: -7.35, b, t }), 2, options.lineOpacity)
        skin.sprites.borderBottom.draw(perspectiveLayout({ l: options.disk ? -6.3 : -7.35, r: options.disk ? 6.3 : 7.35, b: 1.01, t: 0.99 }), 7, 1)

        for (let i = -3; i <= 3; i++) {
            if (i < 3) skin.sprites.draw(
                this.sprites.splitLine,
                perspectiveLayout({ l: i * 2.1 + 1.05 - 0.1, r: i * 2.1 + 1.05 + 0.1, b, t }),
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
            perspectiveLayout({ l: -7.35, r: 7.35, b: 1 + note.radius * 1.25, t: 1 - note.radius * 1.25 }),
            6,
            0.7,
        )

        if (!this.useFallbackStage) skin.sprites.djStage.draw(perspectiveLayout({ l: -7.35, r: 7.35, b, t }), 0, options.opacity)

        skin.sprites.draw(this.sprites.sliderBar, perspectiveLayout({ l: -4.2, r: 4.2, b: slider.y + 0.01 * (slider.y / 1.21), t: slider.y - 0.01 * (slider.y / 1.21) }), -1, 1)
        skin.sprites.draw(this.sprites.slider, perspectiveLayout({ l: slider.position - 0.35, r: slider.position + 0.35, b: slider.y + 0.075 * (slider.y / 1.21), t: slider.y - 0.075 * (slider.y / 1.21) }), 9, 1)

        if (slider.isUsed) this.renderSlider()

        if (!options.noteEffectEnabled) return
        for (let lane = -3; lane <= 3; lane++) {
            let key = streams.getNextKey(lane + 100, time.now - time.delta)

            if (key === time.now - time.delta) continue

            if (key < time.now) particle.effects.emptyTap.spawn(circularEffectLayout({ lane: lane * 2.1, w: 1.05, h: note.radius / scaledScreen.wToH }), 0.5, false)
        }
        // this.renderDisk()
    }

    updateSequentialOrder = -999
    updateSequential() {
        slider.updated = false
        if (replay.isReplay && streams.has(0, -999999)) slider.position = streams.getValue(0, time.now)
        if (bpmChanges.at(slider.next.beat).time < time.now || bpmChanges.at(slider.prev.beat).time > time.now) {
            slider.isUsed = false
            if (!replay.isReplay) slider.position = slider.next.lane * 2.1
        }
        debug.log(slider.position)
        // if (/*(!slider.touch || touches.get(slider.touch).ended) &&*/ !slider.isUsed) {
        //     slider.position = slider.next.lane * 2.1
        //     // debug.log(slider.position)
        // }
    }

    renderDisk() {
        if (options.disk) {
            this.renderLeftDisk()
            this.renderRightDisk()
        }
    }


    renderLeftDisk() {
        archetypes.Disk.spawn({ xOrigin: -8.825, yOrigin: 1, whMultiplier: 1, z: 3, spin: false, skin: skin.sprites.turntableBase.id, tsg: this.data.discTsgL })
        archetypes.Disk.spawn({ xOrigin: -8.825, yOrigin: 1, whMultiplier: 0.82, z: 4, spin: true, skin: skin.sprites.diskOutside.id, tsg: this.data.discTsgL })
        archetypes.Disk.spawn({ xOrigin: -8.825, yOrigin: 1, whMultiplier: 0.325, z: 5, spin: true, skin: skin.sprites.diskInside.id, tsg: this.data.discTsgL })
    }

    renderRightDisk() {
        archetypes.Disk.spawn({ xOrigin: 8.825, yOrigin: 1, whMultiplier: 1, z: 3, spin: false, skin: skin.sprites.turntableBase.id, tsg: this.data.discTsgR })
        archetypes.Disk.spawn({ xOrigin: 8.825, yOrigin: 1, whMultiplier: 0.82, z: 4, spin: true, skin: skin.sprites.diskOutside.id, tsg: this.data.discTsgR })
        archetypes.Disk.spawn({ xOrigin: 8.825, yOrigin: 1, whMultiplier: 0.325, z: 5, spin: true, skin: skin.sprites.diskInside.id, tsg: this.data.discTsgR })
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
        skin.sprites.sliderNote.draw(perspectiveLayout({ l: slider.position - 0.66, r: slider.position + 0.66, b: 1 + note.radius * 2.5, t: 1 - note.radius * 2.5 }), 105, 1)
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

        const x = {
            min: slider.position,
            max: this.getLane(visibleTime.max),
        }

        // const r = {
        //     min: this.getR(visibleTime.min),
        //     max: this.getR(visibleTime.max),
        // }

        const y = {
            min: 1,
            max: approach(visibleTime.max - note.duration, visibleTime.max, scaledTime),
        }

        const thickness = 0.25 * options.noteSize
        const width = x.max - x.min
        const height = (y.max - y.min) / scaledScreen.wToH
        const length = Math.sqrt(width * width + height * height)
        // debug.log(thickness)
        // debug.log(width)
        // debug.log(height)
        // debug.log(length)

        const xS = (thickness * height / length) / 2
        const yS = ((thickness * width / length) / 2) * scaledScreen.wToH
        // debug.log(scaledScreen.wToH)
        //         debug.log(xS)
        //         debug.log(yS)
        const layout = {
            x1: (x.min - xS)/*  * (y.min + yS) */,
            x2: (x.max - xS)/*  * (y.max + yS) */,
            x3: (x.max + xS)/*  * (y.max - yS) */,
            x4: (x.min + xS)/*  * (y.min - yS) */,
            y1: (y.min + yS * y.min),
            y2: (y.max + yS * y.max),
            y3: (y.max - yS * y.max),
            y4: (y.min - yS * y.min),
        }

        layout.x1 *= layout.y1
        layout.x2 *= layout.y2
        layout.x3 *= layout.y3
        layout.x4 *= layout.y4

        skin.sprites.sliderConnector.draw(layout, 90, options.connectorAlpha)
    }

    getLane(time2: number) {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        return Math.remap(scaledTime, this.next.scaledTime, slider.position, slider.next.lane * 2.1, time2)
    }

    // getL(time2: number) {
    //     const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
    //     return Math.remap(scaledTime, this.next.scaledTime, slider.position - (0.125 * options.noteSize), slider.next.lane * 2.1 - (0.125 * options.noteSize), time2)
    // }

    // getR(time2: number) {
    //     const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
    //     return Math.remap(scaledTime, this.next.scaledTime, slider.position + (0.125 * options.noteSize), slider.next.lane * 2.1 + (0.125 * options.noteSize), time2)
    // }
}

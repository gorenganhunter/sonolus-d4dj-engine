import { approach, perspectiveLayout, diskLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { skin } from '../skin.js'
import { isUsed, markAsUsed } from './InputManager.js'
import { slider } from "../slider.js";
import { isClaimed as isScratchClaimed } from "./ScratchManager.js"
import { timeToScaledTime } from './utils.js'
import { scaledScreen } from '../scaledScreen.js'
import { archetypes } from './index.js'

export class Stage extends Archetype {
    data = this.defineImport({
        discTsgL: { name: "discTsgL", type: Number },
        discTsgR: { name: "discTsgR", type: Number }
    })

    touchOrder = 2
    
    sprites = this.entityMemory({
        splitLine: SkinSpriteId,
        borderRight: SkinSpriteId,
        borderLeft: SkinSpriteId,
        slider: SkinSpriteId,
        sliderBar: SkinSpriteId
    })
    
    next = this.entityMemory({
        time: Number,
        scaledTime: Number
    })

    get useFallbackStage() {
        return !skin.sprites.djStage.exists
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
    }

    getLane(touch: Touch) {
        const x = touch.position.x
        const l = x / screen.h * 10.75 / options.width / 2.1
        return l > 3 ? 3 : l < -3 ? -3 : Math.round(l)
    }

    handleSlider(touch: Touch) {
        if ((isUsed(touch) || isScratchClaimed(touch)) && (slider.touch !== touch.id)) return false
// debug.log(isUsed(touch))
        
        if ((slider.touch !== touch.id) && !note.sliderBox.contains(touch.startPosition) && !(!options.judgmentMode && slider.isUsed && new Rect({ l: slider.position - 1.05, r: slider.position + 1.05, t: 0, b: 1 + note.radius * 4 }).transform(skin.transform).contains(touch.startPosition))) return false

        slider.touch = touch.id
        
        const tch = touch.x / screen.h * 10.75 / options.width / (1 + note.radius * 4)
        const sliderPos = (tch > 4.2) ? 4.2 : (tch < -4.2) ? -4.2 : tch
        
        if (!touch.ended) skin.sprites.sliderConnector.draw(perspectiveLayout({ l: sliderPos - 1.05, r: sliderPos + 1.05, b: 1 + note.radius, t: 1 - note.radius * 8 }), 101, 0.5)

        // debug.log(sliderPos)
        slider.position = sliderPos

        if (!isUsed(touch)) markAsUsed(touch)
        return true
    }

    touch() {
        for (const touch of touches) {
            if (this.handleSlider(touch)) continue

            const lane = this.getLane(touch)
            const t = 1 - note.radius
            const b = 1 + note.radius
                
            // if (!(isUsed(touch) && isClaimed(touch)) && (lane === 3 || lane === -3) && (startLane === 3 || startLane === -3)) {
            //     // particle.effects.lane.spawn(perspectiveLayout({ l: lane * 2.1 - 1.05, r: lane * 2.1 + 1.05, b, t }), 0.3, false)
            //     if (touch.started) {
            //         startClaim(touch)
            //         markAsUsed(touch)
            //     }
            //     else {
            //         claim(touch)
            //         if (options.sfxEnabled) effect.clips.scratchEmpty.play(0.02)
            //         if (options.noteEffectEnabled) particle.effects.emptyTap.spawn(perspectiveLayout({ l: lane * 2.1 - 1.05, r: lane * 2.1 + 1.05, b, t }), 0.3, false)
            //         debug.log(time.scaled)
            //     }
            //     return
            // }

            if (isUsed(touch)) continue

            if (!touch.started) continue

            // const lane = this.getLane(touch)
            // const t = 1 - note.radius * 2
            // const b = 1 + note.radius

            
            if (lane < 3 && lane > -3) {
                if (options.sfxEnabled) effect.clips.tapEmpty.play(0.02)
                // else if (!isClaimed(touch)) effect.clips.scratchEmpty.play(0.02)
                if (options.noteEffectEnabled) particle.effects.emptyTap.spawn(perspectiveLayout({ l: lane * 2.1 - 1.05, r: lane * 2.1 + 1.05, b, t }), 0.3, false)
            } else if (!isScratchClaimed(touch)) {
                if (options.sfxEnabled) effect.clips.scratchEmpty.play(0.02)
                if (options.noteEffectEnabled) particle.effects.emptyTap.spawn(perspectiveLayout({ l: lane * 2.1 - 1.05, r: lane * 2.1 + 1.05, b, t }), 0.3, false)
            }
            return
        }
    }

    spawnOrder() {
        return 1
    }

    shouldSpawn() {
        return entityInfos.get(0).state === EntityState.Despawned
    }

    updateSequential() {
        if (/*(!slider.touch || touches.get(slider.touch).ended) &&*/ !slider.isUsed) {
            slider.position = slider.next.lane * 2.1
            // debug.log(slider.position)
        }
    }
    
    renderSlider() {
        skin.sprites.sliderNote.draw(perspectiveLayout({ l: slider.position - 0.5, r: slider.position + 0.5, b: 1 + note.radius * 2.5, t: 1 - note.radius * 2.5 }), 105, 1)
        this.renderConnector()
    }
    
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

    getL(time2: number) {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        return Math.remap(scaledTime, this.next.scaledTime, slider.position - (0.125 * options.noteSize), slider.next.lane * 2.1 - (0.125 * options.noteSize), time2)
    }

    getR(time2: number) {
        const scaledTime = options.backspinAssist ? time.now : timeToScaledTime(time.now, slider.next.timescaleGroup)
        return Math.remap(scaledTime, this.next.scaledTime, slider.position + (0.125 * options.noteSize), slider.next.lane * 2.1 + (0.125 * options.noteSize), time2)
    }

    initialize() {
        this.sprites.slider = skin.sprites.slider.exists ? skin.sprites.slider.id : skin.sprites.sliderFallback.id
        this.sprites.sliderBar = skin.sprites.sliderBar.exists ? skin.sprites.sliderBar.id : skin.sprites.sliderBarFallback.id
    }

    updateParallel() {
        // debug.log(time.now - time.scaled)
        // const layout = new Rect({
        //     l: judgeLine.l,
        //     r: judgeLine.r,
        //     t: 1 - note.radius / 4,
        //     b: 1 + note.radius / 4,
        // })
        skin.sprites.draw(this.sprites.sliderBar, perspectiveLayout({ l: -4.2, r: 4.2, b: 1 + note.radius * 3.9, t: 0.99 + note.radius * 3.9 }), 3, 1)
        skin.sprites.draw(this.sprites.slider, perspectiveLayout({ l: slider.position - 0.35, r: slider.position + 0.35, b: 1.075 + note.radius * 3.9, t: 0.925 + note.radius * 3.9 }), 4, 1)
        if(slider.isUsed) this.renderSlider()

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

        this.renderDisk()
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
}

import { approach, perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { skin } from '../skin.js'
import { isUsed, markAsUsed } from './InputManager.js'
import { claim, isClaimed, startClaim } from './ScratchManager.js'

export class Stage extends Archetype {
    touchOrder = 3

    sprites = this.entityMemory({
        splitLine: SkinSpriteId,
        borderRight: SkinSpriteId,
        borderLeft: SkinSpriteId
    })

    get useFallbackStage() {
        return !skin.sprites.djStage.exists
    }
    
    preprocess() {
        this.sprites.splitLine = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.splitLine.id
        this.sprites.borderRight = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.borderRight.id
        this.sprites.borderLeft = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.borderLeft.id
    }

    getLane(touch: Touch) {
        const x = touch.position.x
        const l = x / screen.h * 10.75 / options.width / 2.1
        return l > 3 ? 3 : l < -3 ? -3 : Math.round(l)
    }

    touch() {
        for (const touch of touches) {
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
            } else if (!isClaimed(touch)) {
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

    updateParallel() {
        // debug.log(time.now - time.scaled)
        // const layout = new Rect({
        //     l: judgeLine.l,
        //     r: judgeLine.r,
        //     t: 1 - note.radius / 4,
        //     b: 1 + note.radius / 4,
        // })

        const hidden = approach(0, 1, 1 - options.laneLength)

        const t = 0 + hidden
        const b = 1

        skin.sprites.draw(this.sprites.borderRight, perspectiveLayout({ l: 7.35, r: 7.5, b, t }), 2, options.lineOpacity)
        skin.sprites.draw(this.sprites.borderLeft, perspectiveLayout({ l: -7.5, r: -7.35, b, t }), 2, options.lineOpacity)
        skin.sprites.borderBottom.draw(perspectiveLayout({ l: -7.35, r: 7.35, b: 1.01, t: 0.99 }), 2, 1)

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
                3, 
                1,
            )
        }

        skin.sprites.judgeLine.draw(
            perspectiveLayout({ l: -7.35, r: 7.35, b: 1 + note.radius, t: 1 - note.radius }),
            1,
            0.7,
        )

        if (!this.useFallbackStage) skin.sprites.djStage.draw(perspectiveLayout({ l: -7.35, r: 7.35, b, t }), 0, options.opacity)
    }
}

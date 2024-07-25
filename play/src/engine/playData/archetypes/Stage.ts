import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { options } from '../../configuration/options.js'
import { effect } from '../effect.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { skin } from '../skin.js'
import { isUsed } from './InputManager.js'
import { claim, isClaimed } from './ScratchManager.js'

export class Stage extends Archetype {
    touchOrder = 3

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

            if (isUsed(touch)) continue

            if (!touch.started) continue
                // if (!isClaimed(touch) && (lane === 3 || lane === -3)) {
                //     effect.clips.scratchEmpty.play(0.02)
                //     particle.effects.lane.spawn(perspectiveLayout({ l: lane * 2.1 - 1.05, r: lane * 2.1 + 1.05, b, t }), 0.3, false)
                //     claim(touch)
                // }

            // const lane = this.getLane(touch)
            // const t = 1 - note.radius * 2
            // const b = 1 + note.radius

            if (options.sfxEnabled) {
                if (lane < 3 && lane > -3) effect.clips.tapEmpty.play(0.02)
                // else if (!isClaimed(touch)) effect.clips.scratchEmpty.play(0.02)
            }
            if (options.noteEffectEnabled) particle.effects.emptyTap.spawn(perspectiveLayout({ l: lane * 2.1 - 1.05, r: lane * 2.1 + 1.05, b, t }), 0.3, false)

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

        const t = 0 + note.radius
        const b = 1

        skin.sprites.line.draw(perspectiveLayout({ l: 7.35, r: 7.5, b, t }), 2, options.lineOpacity)
        skin.sprites.line.draw(perspectiveLayout({ l: -7.5, r: -7.35, b, t }), 2, options.lineOpacity)
        skin.sprites.borderBottom.draw(perspectiveLayout({ l: -7.35, r: 7.35, b: 1.01, t: 0.99 }), 2, 1)

        for (let i = -3; i <= 3; i++) {
            if (i < 3) skin.sprites.line.draw(
                perspectiveLayout({ l: i * 2.1 + 1.05 - 0.08, r: i * 2.1 + 1.05 + 0.08, b, t }),
                2,
                options.lineOpacity,
            )
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

        skin.sprites.lane.draw(perspectiveLayout({ l: -7.35, r: 7.35, b: 1, t }), 0, options.opacity)

    }
}

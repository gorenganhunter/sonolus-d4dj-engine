import { options } from '../../configuration/options.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { skin } from '../skin.js'
import { slider } from '../slider.js'
import { archetypes } from './index.js'

export class Initialization extends Archetype {
    preprocess() {
        const noteRadius = 0.05 * options.noteSize
        const judgeLineY = -0.5

        const t = screen.t * 7 / 9 + noteRadius
        const b = judgeLineY
        const h = t - b

        const transform = Mat.identity.scale(screen.w / 22.3, -h).translate(0, t)

        skin.transform.set(transform)
        particle.transform.set(transform)

        score.base.set({
            perfect: 1,
            great: 0.7,
            good: 0.1,
        })

        note.radius = noteRadius / h
        note.duration = (12 - options.noteSpeed) / 3
        slider.isUsed = false
        slider.next.beat = 99999999

        ui.menu.set({
            anchor: screen.rect.lt.add(new Vec(0.05, -0.05)),
            pivot: { x: 0, y: 1 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })

        ui.judgment.set({
            anchor: { x: 0, y: -0.4 },
            pivot: { x: 0.5, y: 0 },
            size: new Vec(0, 0.15).mul(ui.configuration.judgment.scale),
            rotation: 0,
            alpha: ui.configuration.judgment.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        ui.combo.value.set({
            anchor: { x: screen.r * 0.7, y: 0 },
            pivot: { x: 0.5, y: 0 },
            size: new Vec(0, 0.2).mul(ui.configuration.combo.scale),
            rotation: 0,
            alpha: ui.configuration.combo.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        ui.combo.text.set({
            anchor: { x: screen.r * 0.7, y: 0 },
            pivot: { x: 0.5, y: 1 },
            size: new Vec(0, 0.12).mul(ui.configuration.combo.scale),
            rotation: 0,
            alpha: ui.configuration.combo.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: false,
        })

        ui.metric.primary.bar.set({
            anchor: screen.rect.rt.sub(new Vec(0.05, 0.05)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0.75, 0.15).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })

        ui.metric.primary.value.set({
            anchor: screen.rect.rt
                .sub(new Vec(0.05, 0.05))
                .sub(new Vec(0.035, 0.035).mul(ui.configuration.metric.primary.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        ui.metric.secondary.bar.set({
            anchor: screen.rect.rt
                .sub(new Vec(0.05, 0.05))
                .sub(new Vec(0, 0.15).mul(ui.configuration.metric.primary.scale))
                .sub(new Vec(0, 0.05)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0.75, 0.15).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })

        ui.metric.secondary.value.set({
            anchor: screen.rect.rt
                .sub(new Vec(0.05, 0.05))
                .sub(new Vec(0, 0.15).mul(ui.configuration.metric.primary.scale))
                .sub(new Vec(0, 0.05))
                .sub(new Vec(0.035, 0.035).mul(ui.configuration.metric.secondary.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        for (const archetype of Object.values(archetypes)) {
            if (!('globalPreprocess' in archetype)) continue

            archetype.globalPreprocess()
        }
    }

    spawnOrder() {
        return 0
    }

    updateSequential() {
        archetypes.InputManager.spawn({})
        archetypes.HoldManager.spawn({})
        archetypes.ScratchManager.spawn({})
        archetypes.Slider.spawn({})

        this.despawn = true
    }
}

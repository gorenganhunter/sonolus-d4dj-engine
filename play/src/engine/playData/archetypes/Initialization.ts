import { options } from '../../configuration/options.js'
import { note } from '../note.js'
import { particle } from '../particle.js'
import { scaledScreen } from '../scaledScreen.js'
import { skin } from '../skin.js'
import { slider } from '../slider.js'
import { archetypes } from './index.js'

export class Initialization extends Archetype {
    preprocess() {
        const noteRadius = 0.05 * options.noteSize
        const judgeLineY = -0.4725

        const t = screen.t * 0.85
        const b = judgeLineY
        const w = screen.h / 10 * options.width
        const h = t - b

        const transform = Mat.identity.scale(w, -h).translate(0, t)

        scaledScreen.l = screen.l / w
        scaledScreen.r = screen.r / w
        scaledScreen.b = screen.b / -h
        scaledScreen.t = screen.t / -h

        scaledScreen.w = screen.w / w
        scaledScreen.h = screen.h / h

        scaledScreen.wToH = w / h

        skin.transform.set(transform)
        particle.transform.set(transform)

        score.base.set({
            perfect: 1,
            great: 0.7,
            good: 0.1,
        })

        note.radius = noteRadius / h
        note.duration = 0.5 + (12 - options.noteSpeed) * 0.4
        slider.isUsed = false
        slider.next.beat = 99999999

        switch (options.scratchSensitivity) {
            case -2:
                note.scratch.angle = 120
                note.scratch.distance = 0.2
                note.scratch.movement = 10
                break;
            case -1:
                note.scratch.angle = 115
                note.scratch.distance = 0.1
                note.scratch.movement = 5
                break;
            case 0:
                note.scratch.angle = 105
                note.scratch.distance = 0.07
                note.scratch.movement = 1
                break;
            case 1:
                note.scratch.angle = 95
                note.scratch.distance = 0.03
                note.scratch.movement = 0.75
                break;
            case 2:
                note.scratch.angle = 75
                note.scratch.distance = 0
                note.scratch.movement = 0.5
                break;
        }
        
        new Rect({ l: -6.3, r: 6.3, b: 1.1 + note.radius * 4, t: 0.9 + note.radius * 4 }).transform(transform).copyTo(note.sliderBox)

        const gap = 0.05
        const uiRect = screen.rect.shrink(gap, gap)

        ui.menu.set({
            anchor: uiRect.rt,
            pivot: { x: 1, y: 1 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            horizontalAlign: HorizontalAlign.Center,
            background: true,
        })

        ui.metric.primary.bar.set({
            anchor: uiRect.lt,
            pivot: { x: 0, y: 1 },
            size: new Vec(0.75, 0.15).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })
        ui.metric.primary.value.set({
            anchor: uiRect.lt.add(
                    new Vec(0.715, -0.035).mul(ui.configuration.metric.primary.scale),
                ),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.primary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.primary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })

        ui.metric.secondary.bar.set({
            anchor: uiRect.rt
                .sub(new Vec(gap, 0))
                .sub(new Vec(0.15, 0).mul(ui.configuration.menu.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0.55, 0.15).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Left,
            background: true,
        })
        ui.metric.secondary.value.set({
            anchor: uiRect.rt
                .sub(new Vec(gap, 0))
                .sub(new Vec(0.15, 0).mul(ui.configuration.menu.scale))
                .sub(new Vec(0.035, 0.035).mul(ui.configuration.metric.secondary.scale)),
            pivot: { x: 1, y: 1 },
            size: new Vec(0, 0.08).mul(ui.configuration.metric.secondary.scale),
            rotation: 0,
            alpha: ui.configuration.metric.secondary.alpha,
            horizontalAlign: HorizontalAlign.Right,
            background: false,
        })
        
        ui.judgment.set({
            anchor: { x: 0, y: -0.1 },
            pivot: { x: 0.5, y: 0 },
            size: new Vec(0, 0.1).mul(ui.configuration.judgment.scale),
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

        this.despawn = true
    }
}

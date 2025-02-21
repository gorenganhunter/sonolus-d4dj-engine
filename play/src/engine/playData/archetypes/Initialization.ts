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
        const judgeLineY = -0.4725 + options.judgelineHeight * 0.02775

        const t = 0.85
        const b = judgeLineY
        const w = screen.h * options.width * (1.3225 - options.judgelineHeight * 0.02775) / 13.225
        const h = t - b

        const transform = Mat.identity.scale(w, -h).translate(0, t)

        scaledScreen.l = screen.l / w
        scaledScreen.r = screen.r / w
        scaledScreen.b = screen.b / -h
        scaledScreen.t = screen.t / -h

        scaledScreen.w = screen.w / w
        scaledScreen.h = screen.h / h

        scaledScreen.wToH = w / h

        slider.y = (-0.75 - t) / -h

        skin.transform.set(transform)
        particle.transform.set(transform)

        score.base.set({
            perfect: 1,
            great: 0.7,
            good: 0.1,
        })

        note.radius = noteRadius / 1.3225
        note.duration = 0.5 + (12 - options.noteSpeed) * 0.4
        slider.isUsed = false
        slider.next.beat = 99999999
        slider.saved = false
        slider.lastSavedPosition = 100000
        slider.lastSavedTime = -999

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

        new Rect({ l: -30, r: -5.25, b: 5, t: -5 }).transform(transform).copyTo(note.scratch.hitbox.left)
        new Rect({ l: 5.25, r: 30, b: 5, t: -5 }).transform(transform).copyTo(note.scratch.hitbox.right)
        
        new Rect({ l: -4.2 * slider.y, r: 4.2 * slider.y, b: slider.y + 0.075 * (slider.y / 1.21), t: slider.y - 0.075 * (slider.y / 1.21) }).transform(transform).copyTo(note.sliderBox)

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
        archetypes.Slider.spawn({})

        this.despawn = true
    }
}

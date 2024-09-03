import { options } from "../../configuration/options.js"
import { hand } from "../hand.js"
import { note } from "../note.js"
import { particle } from "../particle.js"
import { skin } from "../skin.js"

export const initialization = {
    preprocess() {
        const noteRadius = 0.05 * 1.5 /*  * options.noteSize */
        const judgeLineY = -0.5

        const t = screen.t * 7 / 9 + noteRadius
        const b = judgeLineY
        const h = t - b
        new Vec(0, -1)
            .rotate(Math.PI / 3)
            .mul(0.25 * ui.configuration.instruction.scale)
            .translate(0, b)
            .copyTo(hand.position)

        const transform = Mat.identity.scale(screen.h / 10.75/*  * options.width */, -h).translate(0, t)

        skin.transform.set(transform)
        particle.transform.set(transform)

        note.radius = noteRadius / h
        const gap = 0.05
        const uiRect = screen.rect.shrink(gap, gap)

        ui.menu.set({
            anchor: uiRect.rt,
            pivot: { x: 1, y: 1 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.menu.scale),
            rotation: 0,
            alpha: ui.configuration.menu.alpha,
            background: true,
        })

        ui.navigation.previous.set({
            anchor: uiRect.cl,
            pivot: { x: 0, y: 0.5 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.navigation.scale),
            rotation: 0,
            alpha: ui.configuration.navigation.alpha,
            background: true,
        })
        ui.navigation.next.set({
            anchor: uiRect.cr,
            pivot: { x: 1, y: 0.5 },
            size: new Vec(0.15, 0.15).mul(ui.configuration.navigation.scale),
            rotation: 0,
            alpha: ui.configuration.navigation.alpha,
            background: true,
        })

        ui.instruction.set({
            anchor: Vec.zero,
            pivot: { x: 0.5, y: 0.5 },
            size: new Vec(1.2, 0.15).mul(ui.configuration.instruction.scale),
            rotation: 0,
            alpha: ui.configuration.instruction.alpha,
            background: true,
        })
    },

    update() {},
}

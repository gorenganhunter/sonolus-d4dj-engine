import { approach, perspectiveLayout } from "../../../../../shared/src/engine/data/utils.js"
import { note } from "../note.js"
import { skin } from "../skin.js"
import { slider } from "../slider.js"

export const stage = {
    update() {
        const splitLine = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.splitLine.id
        const borderRight = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.borderRight.id
        const borderLeft = skin.sprites.line.exists ? skin.sprites.line.id : skin.sprites.borderLeft.id

        const hidden = approach(0, 1, 0)

        const t = 0 + hidden
        const b = 1

        skin.sprites.draw(borderRight, perspectiveLayout({ l: 7.35, r: 7.5, b, t }), 2, 0.9)
        skin.sprites.draw(borderLeft, perspectiveLayout({ l: -7.5, r: -7.35, b, t }), 2, 0.9)
        skin.sprites.borderBottom.draw(perspectiveLayout({ l: -7.35, r: 7.35, b: 1.01, t: 0.99 }), 2, 1)

        for (let i = -3; i <= 3; i++) {
            if (i < 3) skin.sprites.draw(
                splitLine,
                perspectiveLayout({ l: i * 2.1 + 1.05 - 0.08, r: i * 2.1 + 1.05 + 0.08, b, t }),
                2,
                0.9,
            )
            skin.sprites.slot.draw(
                perspectiveLayout({ l: i * 2.1 - 0.25, r: i * 2.1 + 0.25, b: 1.02, t: 0.98 }),
                3, 
                1,
            )
            if (!skin.sprites.djStage.exists) {
                if ((i === -3 || i === 3) && skin.sprites.laneAlt.exists) skin.sprites.laneAlt.draw(
                    perspectiveLayout({ l: i * 2.1 - 1.05, r: i * 2.1 + 1.05, b, t }),
                    0,
                    0.65,
                )
                else skin.sprites.lane.draw(
                    perspectiveLayout({ l: i * 2.1 - 1.05, r: i * 2.1 + 1.05, b, t }),
                    0,
                    0.65,
                )
            }
        }

        skin.sprites.judgeLine.draw(
            perspectiveLayout({ l: -7.35, r: 7.35, b: 1 + note.radius, t: 1 - note.radius }),
            1,
            0.7,
        )

        if (skin.sprites.djStage.exists) skin.sprites.djStage.draw(perspectiveLayout({ l: -7.35, r: 7.35, b, t }), 0, 0.65)
        
        skin.sprites.sliderBar.draw(perspectiveLayout({ l: -4.2, r: 4.2, b: 1 + note.radius * 3.9, t: 0.99 + note.radius * 3.9 }), 3, 1)
        skin.sprites.slider.draw(perspectiveLayout({ l: slider.position - 0.35, r: slider.position + 0.35, b: 1.075 + note.radius * 3.9, t: 0.925 + note.radius * 3.9 }), 4, 1)
    }
}

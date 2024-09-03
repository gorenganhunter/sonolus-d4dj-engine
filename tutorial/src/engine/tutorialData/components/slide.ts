import { perspectiveLayout } from "../../../../../shared/src/engine/data/utils.js"
import { note } from "../note.js"
import { layer, skin } from "../skin.js"

const sprites = {
    slide: skin.sprites.holdHead,
}

let mode = tutorialMemory(Boolean)

export const slide = {
    update() {
        if (!mode) return

        const l = -1.05 * 1.5
        const r = 1.05 * 1.5

        const t = 1 - note.radius
        const b = 1 + note.radius

        sprites.slide.draw(perspectiveLayout({ l, r, t, b }), layer.note.body, 1)
    },

    show() {
        mode = true
    },

    clear() {
        mode = false
    },
}

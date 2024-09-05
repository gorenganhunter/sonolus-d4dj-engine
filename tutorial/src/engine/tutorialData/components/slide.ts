import { perspectiveLayout } from "../../../../../shared/src/engine/data/utils.js"
import { note } from "../note.js"
import { layer, skin } from "../skin.js"

const slideSprites = {
    hold: {
        slide: skin.sprites.holdHead
    },
    slider: {
        slide: skin.sprites.sliderNote
    }
}

let mode = tutorialMemory(Boolean)
let id = tutorialMemory(SkinSpriteId)
let layout = tutorialMemory(Quad)

export const slide = {
    update() {
        if (!mode) return

        skin.sprites.draw(id, layout, layer.note.body, 1)
    },

    show(type: keyof typeof slideSprites) {
        this.setType(type)
        this.setLayout(type)
        mode = true
    },

    clear() {
        mode = false
    },
    
    setType(type: keyof typeof slideSprites) {
        for (const [key, sprites] of Object.entries(slideSprites)) {
            if (key !== type) continue

            // if ('fallback' in sprites && !sprites.note.exists) {
            //     id = sprites.fallback.id
            // } else {
                id = sprites.slide.id
            // }
        }
    },
    
    setLayout(type: keyof typeof slideSprites) {
        if (type === 'hold') {
            const l = -1.05 * 1.5
            const r = 1.05 * 1.5

            const t = 1 - note.radius
            const b = 1 + note.radius

            perspectiveLayout({ l, r, b, t }).copyTo(layout)
        } else {
            const l = -0.5
            const r = 0.5

            // if (type === 'left') {
            //     leftRotated({ l, r, b, t }).copyTo(overlay)
            // } else {
            perspectiveLayout({ l, r, b: 0.95 + note.radius * 4, t: 1 - note.radius * 2 }).copyTo(layout)
            // }
        }
    },
}

import { approach, perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { note } from '../note.js'
import { segment } from '../segment.js'
import { layer, skin } from '../skin.js'

const arrowSprites = {
    scratch: {
        note: skin.sprites.scratchArrow,
    },
    slider: {
        note: skin.sprites.sliderArrow,
    },
}

enum Mode {
    None,
    Overlay,
    Fall,
    Frozen,
}

let mode = tutorialMemory(DataType<Mode>)

let id = tutorialMemory(SkinSpriteId)
const overlay = tutorialMemory(Quad)
const layout = tutorialMemory(Quad)
const animation = tutorialMemory(Vec)

export const flickArrow = {
    update() {
        if (!mode) return

        if (mode === Mode.Overlay) {
            const a = Math.unlerpClamped(1, 0.75, segment.time.now)

            skin.sprites.draw(id, overlay, layer.note.arrow, a)
        } else {
            const y = mode === Mode.Fall ? approach(0, 2, segment.time.now) : 1
            const s =
                mode === Mode.Fall
                    ? Math.lerp(-0.25, 0.25, Math.frac(segment.time.now * 3 + 0.5))
                    : 0

            skin.sprites.draw(id, layout.add(animation.mul(s)).mul(y), layer.note.arrow, 1)
        }
    },

    showOverlay(type: keyof typeof arrowSprites) {
        mode = Mode.Overlay
        this.setType(type)
        this.setOverlay(type)
    },

    showFall(type: keyof typeof arrowSprites) {
        mode = Mode.Fall
        this.setType(type)
        this.setLayoutAndAnimation(type)
    },

    showFrozen(type: keyof typeof arrowSprites) {
        mode = Mode.Frozen
        this.setType(type)
        this.setLayoutAndAnimation(type)
    },

    clear() {
        mode = Mode.None
    },

    setType(type: keyof typeof arrowSprites) {
        for (const [key, sprites] of Object.entries(arrowSprites)) {
            if (key !== type) continue

            // if ('fallback' in sprites && !sprites.note.exists) {
            //     id = sprites.fallback.id
            // } else {
                id = sprites.note.id
            // }
        }
    },

    setOverlay(type: keyof typeof arrowSprites) {
        if (type === 'scratch') {
            const l = -1.05 * 2.5
            const r = 1.05 * 2.5

            const t = 0.5 - note.radius * 10
            const b = 0.5 - note.radius * 2

            new Rect({ l, r, b, t }).toQuad().copyTo(overlay)
        } else {
            const l = -3.15 * 5 / 3
            const r = -1.05 * 5 / 3

            const t = 0.5 - note.radius * 2
            const b = 0.5 + note.radius * 2

            // if (type === 'left') {
            //     leftRotated({ l, r, b, t }).copyTo(overlay)
            // } else {
                new Rect({ l, r, b, t }).toQuad().copyTo(overlay)
            // }
        }
    },

    setLayoutAndAnimation(type: keyof typeof arrowSprites) {
        if (type === 'scratch') {
            const l = -1.05 * 1.5 + 6.3
            const r = 1.05 * 1.5 + 6.3

            const t = 1 - note.radius * 5
            const b = 1 - note.radius

            new Rect({ l, r, b, t }).toQuad().copyTo(layout)
            new Vec({ x: 0, y: -note.radius }).copyTo(animation)
        } else {
            const l = -3.15
            const r = -1.05

            const t = 1 - note.radius
            const b = 1 + note.radius

            // if (type === 'left') {
                perspectiveLayout({ l, r, b, t }).copyTo(layout)
            // } else {
                // new Rect({ l, r, b, t }).toQuad().copyTo(overlay)
            // }

            new Vec({ x: -1, y: 0 }).copyTo(animation)
        }
    },
}

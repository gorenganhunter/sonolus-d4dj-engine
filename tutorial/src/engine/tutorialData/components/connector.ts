import { approach } from '../../../../../shared/src/engine/data/utils.js'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { note } from '../note.js'
import { segment } from '../segment.js'
import { layer, skin } from '../skin.js'

const connectorSprites = {
    hold: {
        connector: skin.sprites.holdConnector
    },
    slider: {
        connector: skin.sprites.sliderConnector
    }
}

enum Mode {
    None,
    OverlayIn,
    OverlayOut,
    FallIn,
    FallOut,
    Frozen,
}

let mode = tutorialMemory(DataType<Mode>)

let id = tutorialMemory(SkinSpriteId)
const overlay = tutorialMemory(Quad)
const layout = tutorialMemory(Quad)
const animation = tutorialMemory(Vec)

export const connector = {
    update() {
        if (!mode) return

        if (mode === Mode.OverlayIn || mode === Mode.OverlayOut) {
            const a = 0.8 * Math.unlerpClamped(1, 0.75, segment.time.now)

            const l = -1.05 * (id === connectorSprites.slider.connector.id ? 0.375 : 2)
            const r = 1.05 * (id === connectorSprites.slider.connector.id ? 0.375 : 2)

            const t = 0.5 - (mode === Mode.OverlayIn ? note.radius * 6 : 0)
            const b = 0.5 + (mode === Mode.OverlayOut ? note.radius * 6 : 0)

            const layout = new Rect({ l, r, t, b })

            skin.sprites.draw(id, layout, layer.note.connector, a)
        } else {
            const t = approach(0, 2, mode === Mode.FallOut ? segment.time.now : 0)
            const b = approach(0, 2, mode === Mode.FallIn ? segment.time.now : 2)

            const layout = perspectiveLayout({ l: -1.05 * (id === connectorSprites.slider.connector.id ? 0.1875 : 1), r: 1.05 * (id === connectorSprites.slider.connector.id ? 0.1875 : 1), b, t })

            skin.sprites.draw(id, layout, layer.note.connector, 0.8)
        }
    },

    showOverlayIn(type: keyof typeof connectorSprites) {
        mode = Mode.OverlayIn
        this.setType(type)
    },

    showOverlayOut(type: keyof typeof connectorSprites) {
        mode = Mode.OverlayOut
        this.setType(type)
    },

    showFallIn(type: keyof typeof connectorSprites) {
        mode = Mode.FallIn
        this.setType(type)
    },

    showFallOut(type: keyof typeof connectorSprites) {
        mode = Mode.FallOut
        this.setType(type)
    },

    showFrozen(type: keyof typeof connectorSprites) {
        mode = Mode.Frozen
        this.setType(type)
    },

    clear() {
        mode = Mode.None
    },
    
    setType(type: keyof typeof connectorSprites) {
        for (const [key, sprites] of Object.entries(connectorSprites)) {
            if (key !== type) continue

            // if ('fallback' in sprites && !sprites.note.exists) {
            //     id = sprites.fallback.id
            // } else {
                id = sprites.connector.id
            // }
        }
    },
}

import { approach } from '../../../../../shared/src/engine/data/utils.js'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { note } from '../note.js'
import { segment } from '../segment.js'
import { layer, skin } from '../skin.js'

const sprites = {
    connector: skin.sprites.holdConnector,
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

export const connector = {
    update() {
        if (!mode) return

        if (mode === Mode.OverlayIn || mode === Mode.OverlayOut) {
            const a = 0.8 * Math.unlerpClamped(1, 0.75, segment.time.now)

            const l = -1.05 * 2
            const r = 1.05 * 2

            const t = 0.5 - (mode === Mode.OverlayIn ? note.radius * 6 : 0)
            const b = 0.5 + (mode === Mode.OverlayOut ? note.radius * 6 : 0)

            const layout = new Rect({ l, r, t, b })

            sprites.connector.draw(layout, layer.note.connector, a)
        } else {
            const t = approach(0, 2, mode === Mode.FallOut ? segment.time.now : 0)
            const b = approach(0, 2, mode === Mode.FallIn ? segment.time.now : 2)

            const layout = perspectiveLayout({ l: -1.05, r: 1.05, b, t })

            sprites.connector.draw(layout, layer.note.connector, 0.8)
        }
    },

    showOverlayIn() {
        mode = Mode.OverlayIn
    },

    showOverlayOut() {
        mode = Mode.OverlayOut
    },

    showFallIn() {
        mode = Mode.FallIn
    },

    showFallOut() {
        mode = Mode.FallOut
    },

    showFrozen() {
        mode = Mode.Frozen
    },

    clear() {
        mode = Mode.None
    },
}

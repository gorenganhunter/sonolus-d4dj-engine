import { approach } from '../../../../../shared/src/engine/data/utils.js'
import { perspectiveLayout } from '../../../../../shared/src/engine/data/utils.js'
import { note } from '../note.js'
import { segment } from '../segment.js'
import { layer, skin } from '../skin.js'

const noteSprites = {
    tapNote: {
        note: skin.sprites.darkTapNote,
    },
    scratchNote: {
        note: skin.sprites.scratch,
        fallback: skin.sprites.scratchFallback
    },
    holdNote: {
        note: skin.sprites.holdHead
    },
    holdEndNote: {
        note: skin.sprites.holdTail
    },
    sliderNote: {
        note: skin.sprites.sliderNote,
    }
}

enum Mode {
    None,
    Overlay,
    Fall,
    Frozen,
}

let mode = tutorialMemory(DataType<Mode>)

let id = tutorialMemory(SkinSpriteId)

export const noteDisplay = {
    update() {
        if (!mode) return

        if (mode === Mode.Overlay) {
            const a = Math.unlerpClamped(1, 0.75, segment.time.now)

            const l = -1.05 * 2.5 * (id === noteSprites.sliderNote.note.id ? 0.33 : 1)
            const r = 1.05 * 2.5 * (id === noteSprites.sliderNote.note.id ? 0.33 : 1)

            const t = 0.5 - note.radius * (id === noteSprites.sliderNote.note.id ? 4 : 2)
            const b = 0.5 + note.radius * (id === noteSprites.sliderNote.note.id ? 4 : 2)
// debug.log(t)
            skin.sprites.draw(id, new Rect({ l, r, t, b }), layer.note.body, a)
        } else {
            const y = mode === Mode.Fall ? approach(0, 2, segment.time.now) : 1

            const l = -1.05 * 1.5 * (id === noteSprites.sliderNote.note.id ? 0.33 : 1) + (id === noteSprites.scratchNote.fallback.id || id === noteSprites.scratchNote.note.id ? 6.3 : 0)
            const r = 1.05 * 1.5 * (id === noteSprites.sliderNote.note.id ? 0.33 : 1) + (id === noteSprites.scratchNote.fallback.id || id === noteSprites.scratchNote.note.id ? 6.3 : 0)

            const t = 1 - note.radius * (id === noteSprites.sliderNote.note.id ? 2 : 1)
            const b = 1 + note.radius * (id === noteSprites.sliderNote.note.id ? 2 : 1)

            // if (id === noteSprites.sliderNote.note.id) {
            //     skin.sprites.draw(id, perspectiveLayout({ l: l - 2.1, r: r - 2.1, t, b }).mul(y), layer.note.body, 1)
            //     skin.sprites.draw(id, perspectiveLayout({ l: l + 2.1, r: r + 2.1, t, b }).mul(y - 0.5), layer.note.body, 1)
            /* } else  */skin.sprites.draw(id, perspectiveLayout({ l, r, t, b }).mul(y), layer.note.body, 1)
        }
    },

    showOverlay(type: keyof typeof noteSprites) {
        mode = Mode.Overlay
        this.setType(type)
    },

    showFall(type: keyof typeof noteSprites) {
        mode = Mode.Fall
        this.setType(type)
    },

    showFrozen(type: keyof typeof noteSprites) {
        mode = Mode.Frozen
        this.setType(type)
    },

    clear() {
        mode = Mode.None
    },

    setType(type: keyof typeof noteSprites) {
        for (const [key, sprites] of Object.entries(noteSprites)) {
            if (key !== type) continue

            if ('fallback' in sprites && !sprites.note.exists) {
                id = sprites.fallback.id
            } else {
                id = sprites.note.id
            }
        }
    },
}

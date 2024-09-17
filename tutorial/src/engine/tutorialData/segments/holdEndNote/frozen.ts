import { noteDisplay } from '../../components/noteDisplay.js'
import { drawHand, instruction } from '../../instruction.js'
import { segment } from '../../segment.js'

export const holdEndNoteFrozen = {
    enter() {
        noteDisplay.showFrozen('holdEndNote')

        instruction.texts.release.show()
    },

    update() {
        drawHand(
            Math.remapClamped(0.25, 0.75, Math.PI / 3, Math.PI / 6, segment.time.now % 1),
            0,
            0,
            Math.unlerpClamped(1, 0.75, segment.time.now % 1),
        )
    },

    exit() {
        noteDisplay.clear()

        instruction.texts.clear()
    },
}
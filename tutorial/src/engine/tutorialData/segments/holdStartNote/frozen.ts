import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'
import { drawHand, instruction } from '../../instruction.js'
import { segment } from '../../segment.js'

export const holdStartNoteFrozen = {
    enter() {
        noteDisplay.showFrozen('holdNote')
        connector.showFrozen()

        instruction.texts.tapAndHold.show()
    },

    update() {
        drawHand(
            Math.remapClamped(0.25, 0.75, Math.PI / 6, Math.PI / 3, segment.time.now % 1),
            0,
            0,
            Math.unlerpClamped(0, 0.25, segment.time.now % 1),
        )
    },

    exit() {
        noteDisplay.clear()
        connector.clear()

        instruction.texts.clear()
    },
}

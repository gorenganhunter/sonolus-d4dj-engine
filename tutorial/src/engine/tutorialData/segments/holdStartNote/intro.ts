import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const holdStartNoteIntro = {
    enter() {
        noteDisplay.showOverlay('holdNote')
        connector.showOverlayIn("hold")
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}

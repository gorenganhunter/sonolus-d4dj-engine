import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const holdEndNoteIntro = {
    enter() {
        noteDisplay.showOverlay('holdEndNote')
        connector.showOverlayOut("hold")
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}

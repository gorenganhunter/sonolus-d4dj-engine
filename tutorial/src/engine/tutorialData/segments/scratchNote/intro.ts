import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const scratchNoteIntro = {
    enter() {
        flickArrow.showOverlay('scratch')
        noteDisplay.showOverlay('scratchNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}

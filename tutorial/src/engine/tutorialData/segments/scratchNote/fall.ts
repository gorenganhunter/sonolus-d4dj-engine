import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const scratchNoteFall = {
    enter() {
        flickArrow.showFall('scratch')
        noteDisplay.showFall('scratchNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}

import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const sliderTickIntro = {
    enter() {
        noteDisplay.showOverlay('sliderNote')
        connector.showOverlayIn()
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}

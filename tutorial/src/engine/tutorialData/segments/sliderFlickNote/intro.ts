import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const sliderFlickIntro = {
    enter() {
        flickArrow.showOverlay('slider')
        noteDisplay.showOverlay('sliderNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}

import { flickArrow } from '../../components/flickArrow.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const sliderFlickFall = {
    enter() {
        flickArrow.showFall('slider')
        noteDisplay.showFall('sliderNote')
    },

    exit() {
        flickArrow.clear()
        noteDisplay.clear()
    },
}

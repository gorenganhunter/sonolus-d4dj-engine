import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const sliderTickFall = {
    enter() {
        noteDisplay.showFall('sliderNote')
        // connector.showFallIn()
    },

    exit() {
        noteDisplay.clear()
        // connector.clear()
    },
}

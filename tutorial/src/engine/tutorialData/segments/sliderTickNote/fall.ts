import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const sliderTickFall = {
    enter() {
        noteDisplay.showFall('sliderNote')
        connector.showFallIn("slider")
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}

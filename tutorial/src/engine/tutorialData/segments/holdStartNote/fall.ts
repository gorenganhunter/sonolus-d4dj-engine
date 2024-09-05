import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const holdStartNoteFall = {
    enter() {
        noteDisplay.showFall('holdNote')
        connector.showFallIn("hold")
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}

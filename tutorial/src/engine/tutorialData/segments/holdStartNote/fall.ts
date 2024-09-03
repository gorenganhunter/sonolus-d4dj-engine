import { connector } from '../../components/connector.js'
import { noteDisplay } from '../../components/noteDisplay.js'

export const holdStartNoteFall = {
    enter() {
        noteDisplay.showFall('holdNote')
        connector.showFallIn()
    },

    exit() {
        noteDisplay.clear()
        connector.clear()
    },
}

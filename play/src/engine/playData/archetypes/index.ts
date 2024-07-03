import { HoldConnector } from './HoldConnector.js'
import { HoldManager } from './HoldManager.js'
import { Initialization } from './Initialization.js'
import { InputManager } from './InputManager.js'
import { ScratchManager } from './ScratchManager.js'
import { Slider } from './Slider.js'
import { Stage } from './Stage.js'
import { BarLine } from './lines/BarLine.js'
import { SimLine } from './lines/SimLine.js'
import { HoldEndNote } from './notes/hold/HoldEndNote.js'
import { HoldStartNote } from './notes/hold/HoldStartNote.js'
import { ScratchNote } from './notes/scratch/ScratchNote.js'
import { SliderFlickNote } from './notes/slider/SliderFlickNote.js'
import { SliderTickNote } from './notes/slider/SliderTickNote.js'
import { StopEndNote } from './notes/stop/StopEndNote.js'
import { StopStartNote } from './notes/stop/StopStartNote.js'
import { DarkTapNote } from './notes/tap/DarkTapNote.js'
import { LightTapNote } from './notes/tap/LightTapNote.js'

export const archetypes = defineArchetypes({
    Initialization,
    Stage,
    InputManager,
    HoldManager,
    ScratchManager,
    Slider,

    DarkTapNote,
    LightTapNote,
    
    HoldStartNote,
    HoldEndNote,
    HoldConnector,

    ScratchNote,

    StopStartNote,
    StopEndNote,

    SliderTickNote,
    SliderFlickNote,

    BarLine,
    SimLine
})

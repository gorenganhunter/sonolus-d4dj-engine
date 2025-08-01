import { Disk } from './Disk.js'
import { HoldConnector } from './HoldConnector.js'
import { HoldManager } from './HoldManager.js'
import { Initialization } from './Initialization.js'
import { InputManager } from './InputManager.js'
import { ScratchManager } from './ScratchManager.js'
import { Stage } from './Stage.js'
import { Slider } from './Slider.js'
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
import { TimeScaleChange } from './timescale/TimeScaleChange.js'
import { TimeScaleGroup } from './timescale/TimeScaleGroup.js'
import { SliderData } from './SliderData.js'
import { SliderFlickParticle } from './notes/slider/SliderFlickParticle.js'

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
    SimLine,

    TimeScaleChange,
    TimeScaleGroup,

    Disk,

    // SliderData,

    SliderFlickParticle
})

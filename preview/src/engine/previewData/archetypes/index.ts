import { Initialization } from './Initialization.js'
import { Stage } from './Stage.js'
import { HoldEndNote } from './notes/hold/HoldEndNote.js'
import { HoldMiddleNote } from './notes/hold/HoldMiddleNote.js'
import { HoldStartNote } from './notes/hold/HoldStartNote.js'
import { ScratchNote } from './notes/scratch/Scratch.js'
import { SliderTickNote } from './notes/slider/SliderTickNote.js'
import { SliderFlickNote } from './notes/slider/SliderFlickNote.js'
import { StopEndNote } from './notes/stop/StopEndNote.js'
import { StopStartNote } from './notes/stop/StopStartNote.js'
import { DarkTapNote } from './notes/tap/DarkTapNote.js'
import { LightTapNote } from './notes/tap/LightTapNote.js'
import { BarLine } from './lines/BarLine.js'
import { SimLine } from './lines/SimLine.js'
import { EngineArchetypeName } from '@sonolus/core'
import { TimeScaleChange } from './TimeScaleChange.js'
import { HoldConnector } from './HoldConnector.js'
import { BpmChange } from './BpmChange.js'

export const archetypes = defineArchetypes({
    Initialization,
    Stage,

    HoldConnector,

    DarkTapNote,
    LightTapNote,

    HoldStartNote,
    HoldMiddleNote,
    HoldEndNote,

    ScratchNote,

    StopStartNote,
    StopEndNote,

    SliderTickNote,
    SliderFlickNote,

    BarLine,
    SimLine,

    TimeScaleChange,
    [EngineArchetypeName.BpmChange]: BpmChange
})

import { connector } from './components/connector.js'
import { flickArrow } from './components/flickArrow.js'
import { initialization } from './components/initialization.js'
import { noteDisplay } from './components/noteDisplay.js'
import { slide } from './components/slide.js'
import { stage } from './components/stage.js'
import { segment } from './segment.js'
import { holdEndNoteFall } from './segments/holdEndNote/fall.js'
import { holdEndNoteFrozen } from './segments/holdEndNote/frozen.js'
import { holdEndNoteHit } from './segments/holdEndNote/hit.js'
import { holdEndNoteIntro } from './segments/holdEndNote/intro.js'
import { holdStartNoteFall } from './segments/holdStartNote/fall.js'
import { holdStartNoteFrozen } from './segments/holdStartNote/frozen.js'
import { holdStartNoteHit } from './segments/holdStartNote/hit.js'
import { holdStartNoteIntro } from './segments/holdStartNote/intro.js'
import { scratchNoteFall } from './segments/scratchNote/fall.js'
import { scratchNoteFrozen } from './segments/scratchNote/frozen.js'
import { scratchNoteHit } from './segments/scratchNote/hit.js'
import { scratchNoteIntro } from './segments/scratchNote/intro.js'
import { sliderFlickFall } from './segments/sliderFlickNote/fall.js'
import { sliderFlickFrozen } from './segments/sliderFlickNote/frozen.js'
import { sliderFlickHit } from './segments/sliderFlickNote/hit.js'
import { sliderFlickIntro } from './segments/sliderFlickNote/intro.js'
import { sliderTickFall } from './segments/sliderTickNote/fall.js'
import { sliderTickFrozen } from './segments/sliderTickNote/frozen.js'
import { sliderTickHit } from './segments/sliderTickNote/hit.js'
import { sliderTickIntro } from './segments/sliderTickNote/intro.js'
import { tapNoteFall } from './segments/tapNote/fall.js'
import { tapNoteFrozen } from './segments/tapNote/frozen.js'
import { tapNoteHit } from './segments/tapNote/hit.js'
import { tapNoteIntro } from './segments/tapNote/intro.js'

const components = [initialization, stage, noteDisplay, slide, connector, flickArrow] as const

const segments = [
    tapNoteIntro, tapNoteFall, tapNoteFrozen, tapNoteHit,
    holdStartNoteIntro, holdStartNoteFall, holdStartNoteFrozen, holdStartNoteHit,
    holdEndNoteIntro, holdEndNoteFall, holdEndNoteFrozen, holdEndNoteHit,
    scratchNoteIntro, scratchNoteFall, scratchNoteFrozen, scratchNoteHit,
    // sliderTickIntro, sliderTickFall, sliderTickFrozen, sliderTickHit,
    sliderFlickIntro, sliderFlickFall, sliderFlickFrozen, sliderFlickHit
] as const

const preprocess = () => {
    segment.current = -1
}

const preprocessComponent = (index: number) => {
    index -= 1

    const component = components[index]
    if (!('preprocess' in component)) return

    component.preprocess()
}

const navigate = () => {
    if (navigation.direction > 0) {
        segment.next = Math.mod(
            segment.current + navigation.direction * (segment.current % 4 ? 1 : 4),
            segments.length,
        )
    } else {
        segment.next = Math.mod(Math.floor(segment.current / 4) * 4 - 4, segments.length)
    }
}

const finishSegment = () => {
    if (segment.current !== segment.next) return
    if (time.now < segment.time.end) return

    segment.next = Math.mod(segment.current + 1, segments.length)
}

const exitCurrentSegment = (index: number) => {
    if (segment.current === segment.next) return

    index -= 1
    if (index !== segment.current) return

    const s = segments[index]
    if (!('exit' in s)) return

    s.exit()
}

const enterNextSegment = (index: number) => {
    if (segment.current === segment.next) return

    index -= 1 + segments.length
    if (index !== segment.next) return

    const s = segments[index]
    if (!('enter' in s)) return

    s.enter()
}

const moveNext = () => {
    if (segment.current === segment.next) return

    segment.current = segment.next

    segment.time.start = time.now
    segment.time.end = segment.time.start

    switch (segment.current % 4) {
        case 0:
            segment.time.end += 1
            break
        case 2:
            segment.time.end += 4
            break
        default:
            segment.time.end += 2
            break
    }
}

const updateSegmentTime = () => {
    segment.time.now = time.now - segment.time.start
}

const updateCurrentSegment = (index: number) => {
    index -= 3 + segments.length * 2
    if (index !== segment.current) return

    const s = segments[index]
    if (!('update' in s)) return

    s.update()
}

const updateComponent = (index: number) => {
    index -= 3 + segments.length * 3

    const component = components[index]
    if (!('update' in component)) return

    component.update()
}

const forEach = (items: readonly unknown[], callback: (index: number) => void) =>
    items.map(() => callback)

export const tutorial = {
    preprocess: [preprocess, ...forEach(components, preprocessComponent)],

    navigate: [navigate],

    update: [
        finishSegment,
        ...forEach(segments, exitCurrentSegment),
        ...forEach(segments, enterNextSegment),
        moveNext,
        updateSegmentTime,
        ...forEach(segments, updateCurrentSegment),
        ...forEach(components, updateComponent),
    ],
}

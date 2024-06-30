import { initialization } from './components/initialization.js'
import { segment } from './segment.js'
import { exampleFall } from './segments/example/fall.js'
import { exampleFrozen } from './segments/example/frozen.js'
import { exampleHit } from './segments/example/hit.js'
import { exampleIntro } from './segments/example/intro.js'

const components = [initialization] as const

const segments = [exampleIntro, exampleFall, exampleFrozen, exampleHit] as const

let current = tutorialMemory(Number)
let next = tutorialMemory(Number)
let startTime = tutorialMemory(Number)
let endTime = tutorialMemory(Number)

const preprocess = () => {
    current = -1
}

const preprocessComponent = (index: number) => {
    index -= 1

    const component = components[index]
    if (!('preprocess' in component)) return

    component.preprocess()
}

const navigate = () => {
    if (navigation.direction > 0) {
        next = Math.mod(current + navigation.direction * (current % 4 ? 1 : 4), segments.length)
    } else {
        next = Math.mod(Math.floor(current / 4) * 4 - 4, segments.length)
    }
}

const finishSegment = () => {
    if (current !== next) return
    if (time.now < endTime) return

    next = Math.mod(current + 1, segments.length)
}

const exitCurrentSegment = (index: number) => {
    if (current === next) return

    index -= 1
    if (index !== current) return

    const segment = segments[index]
    if (!('exit' in segment)) return

    segment.exit()
}

const enterNextSegment = (index: number) => {
    if (current === next) return

    index -= 1 + segments.length
    if (index !== next) return

    const segment = segments[index]
    if (!('enter' in segment)) return

    segment.enter()
}

const moveNext = () => {
    if (current === next) return

    current = next

    startTime = time.now
    endTime = startTime

    switch (current % 4) {
        case 0:
            endTime += 1
            break
        case 2:
            endTime += 4
            break
        default:
            endTime += 2
            break
    }
}

const updateSegmentTime = () => {
    segment.time = time.now - startTime
}

const updateCurrentSegment = (index: number) => {
    index -= 3 + segments.length * 2
    if (index !== current) return

    const segment = segments[index]
    if (!('update' in segment)) return

    segment.update()
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

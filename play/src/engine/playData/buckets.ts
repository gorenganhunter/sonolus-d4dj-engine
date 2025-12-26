import { Text } from '@sonolus/core'
import { skin } from './skin.js'

export const buckets = defineBuckets({
    tapNote: {
        sprites: [
            {
                id: skin.sprites.darkTapNote.id,
                x: -1,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0,
            },
            {
                id: skin.sprites.lightTapNote.id,
                x: 1,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0,
            },
        ],
        unit: Text.MillisecondUnit,
    },
    scratchNote: {
        sprites: [
            {
                id: skin.sprites.scratch.id,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90
            },
            {
                id: skin.sprites.scratchArrow.id,
                x: 1,
                y: 0,
                w: 2,
                h: 2,
                rotation: -90
            }
        ],
        unit: Text.MillisecondUnit
    },
    sliderTickNote: {
        sprites: [
            {
                id: skin.sprites.sliderNote.id,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0
            }
        ],
        unit: Text.MillisecondUnit
    },
    sliderFlickNote: {
        sprites: [
            {
                id: skin.sprites.sliderNote.id,
                x: 0,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0
            },
            {
                id: skin.sprites.sliderArrow.id,
                x: -1,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0
            },
            {
                id: skin.sprites.sliderArrow.id,
                x: -2,
                y: 0,
                w: 2,
                h: 2,
                rotation: 0
            },
        ],
        unit: Text.MillisecondUnit
    },
    holdStartNote: {
        sprites: [
            {
                id: skin.sprites.holdConnector.id,
                x: 0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: 90
            },
            {
                id: skin.sprites.holdHead.id,
                x: -2,
                y: 0,
                w: 2,
                h: 2,
                rotation: 90
            },
        ],
        unit: Text.MillisecondUnit
    },
    holdEndNote: {
        sprites: [
            {
                id: skin.sprites.holdConnector.id,
                x: -2,
                y: 0,
                w: 2,
                h: 5,
                rotation: 90
            },
            {
                id: skin.sprites.holdTail.id,
                x: 0.5,
                y: 0,
                w: 2,
                h: 2,
                rotation: 90
            }
        ],
        unit: Text.MillisecondUnit
    },
    holdMiddleNote: {
        sprites: [
            {
                id: skin.sprites.holdConnector.id,
                x: 0,
                y: 0,
                w: 2,
                h: 5,
                rotation: 90
            },
        ],
        unit: Text.MillisecondUnit
    },
    stopStartNote: {
        sprites: [
            {
                id: skin.sprites.stopConnector.id,
                x: 0.5,
                y: 0,
                w: 2,
                h: 5,
                rotation: 90
            },
            {
                id: skin.sprites.stopHead.id,
                x: -2,
                y: 0,
                w: 2,
                h: 2,
                rotation: 90
            },
        ],
        unit: Text.MillisecondUnit
    },
    stopEndNote: {
        sprites: [
            {
                id: skin.sprites.stopConnector.id,
                x: -2,
                y: 0,
                w: 2,
                h: 5,
                rotation: 90
            },
            {
                id: skin.sprites.stopTail.id,
                x: 0.5,
                y: 0,
                w: 2,
                h: 2,
                rotation: 90
            }
        ],
        unit: Text.MillisecondUnit
    }
})

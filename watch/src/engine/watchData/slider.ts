export const slider = levelMemory({
    y: Number,
    position: Number,
    isUsed: Boolean,
    prev: {
        beat: Number,
        lane: Number,
        timescaleGroup: Number
    },
    next: {
        beat: Number,
        lane: Number,
        timescaleGroup: Number
    }
})

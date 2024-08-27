export const slider = levelMemory({
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

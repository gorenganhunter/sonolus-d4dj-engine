export const slider = levelMemory({
    y: Number,
    position: Number,
    isUsed: Boolean,
    touch: Number,
    next: {
        beat: Number,
        lane: Number,
        timescaleGroup: Number
    }
})

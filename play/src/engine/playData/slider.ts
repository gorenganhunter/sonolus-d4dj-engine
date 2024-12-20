export const slider = levelMemory({
    y: Number,
    position: Number,
    isUsed: Boolean,
    touch: TouchId,
    next: {
        beat: Number,
        lane: Number,
        timescaleGroup: Number
    }
})

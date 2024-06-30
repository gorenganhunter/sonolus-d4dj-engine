export const slider = levelMemory({
    position: Number,
    isUsed: Boolean,
    touch: TouchId,
    next: {
        beat: Number,
        lane: Number
    }
})

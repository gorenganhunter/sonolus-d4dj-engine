type Windows = {
    perfect: Range
    great: Range
    good: Range
}

export type DualWindows = {
    normal: Windows
    strict: Windows
}

export const toWindows = (dualWindows: DualWindows, strictJudgment: boolean) => {
    const toWindow = (key: 'perfect' | 'great' | 'good') =>
        new Range(
            strictJudgment ? dualWindows.strict[key].min : dualWindows.normal[key].min,
            strictJudgment ? dualWindows.strict[key].max : dualWindows.normal[key].max,
        )

    return {
        perfect: toWindow('perfect'),
        great: toWindow('great'),
        good: toWindow('good'),
    }
}

const toMs = ({ min, max }: Range) => new Range(Math.round(min * 1000), Math.round(max * 1000))

export const toBucketWindows = (windows: Windows) => ({
    perfect: toMs(windows.perfect),
    great: toMs(windows.great),
    good: toMs(windows.good),
})

export const windows = {
    normal: {
        perfect: Range.one.mul(0.05),
        great: Range.one.mul(0.1),
        good: Range.one.mul(0.15)
    },
    strict: {
        perfect: Range.one.mul(0.025),
        great: Range.one.mul(0.05),
        good: Range.one.mul(0.1)
    },
}

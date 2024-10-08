export const perspectiveLayout = ({ l, r, b, t }: { l: number, r: number, b: number, t: number }) =>
    new Quad({
        x1: l * b,
        x2: l * t,
        x3: r * t,
        x4: r * b,
        y1: b,
        y2: t,
        y3: t,
        y4: b,
    })

export const approach = (fromTime: number, toTime: number, now: number) =>
    now <= toTime ? 1 / Math.remap(fromTime, toTime, 20, 1, now) : Math.min(1.5, Math.remap(toTime, toTime + (toTime - fromTime), 1, 20, now))

export const leftRotated = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: r,
        x2: l,
        x3: l,
        x4: r,
        y1: b,
        y2: b,
        y3: t,
        y4: t,
    })

export const rightRotated = ({ l, r, b, t }: RectLike) =>
    new Quad({
        x1: l,
        x2: r,
        x3: r,
        x4: l,
        y1: t,
        y2: t,
        y3: b,
        y4: b,
    })

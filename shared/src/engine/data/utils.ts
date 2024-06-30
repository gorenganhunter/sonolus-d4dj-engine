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
    1.06 ** (45 * Math.remap(fromTime, toTime, -1, 0, now))

export const leftRotated = ({ p1, p2, p3, p4 }: { p1: Vec, p2: Vec, p3: Vec, p4: Vec }) =>
    new Quad({
        p1: p2,
        p2: p3,
        p3: p4,
        p4: p1
    })

export const rightRotated = ({ p1, p2, p3, p4 }: { p1: Vec, p2: Vec, p3: Vec, p4: Vec }) =>
    new Quad({
        p1: p4,
        p2: p1,
        p3: p2,
        p4: p3
    })

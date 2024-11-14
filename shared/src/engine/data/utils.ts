export const perspectiveLayout = ({ l, r, b, t }: { l: number; r: number; b: number; t: number }) =>
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

export const diskLayout = ({ l, r, b, t }: { l: number; r: number; b: number; t: number }) =>
    new Quad({
        x1: l * ((b - 1) / 5 + 1),
        x2: l * ((t - 1) / 5 + 1),
        x3: r * ((t - 1) / 5 + 1),
        x4: r * ((b - 1) / 5 + 1),
        y1: b,
        y2: t,
        y3: t,
        y4: b,
    })

export const approach = (fromTime: number, toTime: number, now: number) =>
    now <= toTime
        ? 1 / Math.remap(fromTime, toTime, 20, 1, now)
        : Math.min(1.5, Math.remap(toTime, toTime + (toTime - fromTime), 1, 20, now))

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

export const rotate = (
    { x, y }: Vec,
    { l, r, b, t }: RectLike,
    angle: number,
    wToH: number,
): Quad => {
    const y1 = (l - x) * wToH * Math.sin(angle) + (b - y) * Math.cos(angle) + y
    const y2 = (l - x) * wToH * Math.sin(angle) + (t - y) * Math.cos(angle) + y
    const y3 = (r - x) * wToH * Math.sin(angle) + (t - y) * Math.cos(angle) + y
    const y4 = (r - x) * wToH * Math.sin(angle) + (b - y) * Math.cos(angle) + y
    const x1 = (l - x) * Math.cos(angle) - ((b - y) / wToH) * Math.sin(angle) + x
    const x2 = (l - x) * Math.cos(angle) - ((t - y) / wToH) * Math.sin(angle) + x
    const x3 = (r - x) * Math.cos(angle) - ((t - y) / wToH) * Math.sin(angle) + x
    const x4 = (r - x) * Math.cos(angle) - ((b - y) / wToH) * Math.sin(angle) + x
    return new Quad({
        x4: x1 /* ((y1 - 1) / 5 + 1)*/,
        x3: x2 /* ((y2 - 1) / 5 + 1)*/,
        x2: x3 /* ((y3 - 1) / 5 + 1)*/,
        x1: x4 /* ((y4 - 1) / 5 + 1)*/,
        y4: y1,
        y3: y2,
        y2: y3,
        y1: y4,
    })
}

// export const rotate = ({ x, y }: Vec, { l, r, b, t }: RectLike, angle: number, wToH: number ) =>
//     new Quad({
//         x1: (l - x) * Math.cos(angle) - (b - y) / wToH * Math.sin(angle) + x,
//         x2: (l - x) * Math.cos(angle) - (t - y) / wToH * Math.sin(angle) + x,
//         x3: (r - x) * Math.cos(angle) - (t - y) / wToH * Math.sin(angle) + x,
//         x4: (r - x) * Math.cos(angle) - (b - y) / wToH * Math.sin(angle) + x,
//         y1: (l - x) * wToH * Math.sin(angle) + (b - y) * Math.cos(angle) + y,
//         y2: (l - x) * wToH * Math.sin(angle) + (t - y) * Math.cos(angle) + y,
//         y3: (r - x) * wToH * Math.sin(angle) + (t - y) * Math.cos(angle) + y,
//         y4: (r - x) * wToH * Math.sin(angle) + (b - y) * Math.cos(angle) + y,
//     })

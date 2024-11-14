import { scaledScreen } from '../../../../play/src/engine/playData/scaledScreen.js'

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

// export const diskLayout = ({ l, r, b, t }: { l: number; r: number; b: number; t: number }) =>
//     new Quad({
//         x1: l * ((b - 1) / 5 + 1),
//         x2: l * ((t - 1) / 5 + 1),
//         x3: r * ((t - 1) / 5 + 1),
//         x4: r * ((b - 1) / 5 + 1),
//         y1: b,
//         y2: t,
//         y3: t,
//         y4: b,
//     })

export const diskLayout = (center: { x: number, y: number }, width: number, height: number, rotation: number) => {
    const prePerspective = Quad.one.rotate(rotation).scale(width, height).translate(center.x, center.y)
    return homogenousTransformQuad(diskTransform, prePerspective)
}

interface Transform2d {
    m00: number, m01: number, m02: number,
    m10: number, m11: number, m12: number,
    m20: number, m21: number, m22: number,
}

/*
This matrix comes from a composition of
scale(1, -1)
translate(0, 1)
perspective_vanish_y(1)  // vanishing point at (0, 1)
translate(0, -1)
scale(1, -1)
 */
const diskTransform: Transform2d = {
    m00: 1, m01: 0, m02: 0,
    m10: 0, m11: 0, m12: 1,
    m20: 0, m21: -1, m22: 2,
}

const homogenousTransformVec = (mat: Transform2d, vec: { x: number, y: number }) => {
    const x = mat.m00 * vec.x + mat.m01 * vec.y + mat.m02
    const y = mat.m10 * vec.x + mat.m11 * vec.y + mat.m12
    const w = mat.m20 * vec.x + mat.m21 * vec.y + mat.m22
    return { x: x / w, y: y / w }
}

const homogenousTransformQuad = (mat: Transform2d, quad: Quad) => {
    const bl = homogenousTransformVec(mat, { x: quad.x1, y: quad.y1 })
    const tl = homogenousTransformVec(mat, { x: quad.x2, y: quad.y2 })
    const tr = homogenousTransformVec(mat, { x: quad.x3, y: quad.y3 })
    const br = homogenousTransformVec(mat, { x: quad.x4, y: quad.y4 })
    return new Quad({ x1: bl.x, y1: bl.y, x2: tl.x, y2: tl.y, x3: tr.x, y3: tr.y, x4: br.x, y4: br.y })
}

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

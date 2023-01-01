/**
 * Create bounding vertices for a rectangle
 * @param b Bottom coordinate
 * @param l Left coordinate
 * @param w Rectangle width
 * @param h Rectangle height
 * @returns The rectangle bounding vertices and centroids vertex attributes
 */
export function makeRectVerts(
    b: number,
    l: number,
    w: number,
    h: number
): [vertices: number[], centroids: number[]] {
    // Rectangle vertices
    const v = [l, b, l + w, b, l, b + h, l, b + h, l + w, b, l + w, b + h];

    // The centroids for the two triangles
    const cA = [(v[0] + v[2] + v[4]) / 3, (v[1] + v[3] + v[5]) / 3];
    const cB = [(v[6] + v[8] + v[10]) / 3, (v[7] + v[9] + v[11]) / 3];

    return [v, [...cA, ...cA, ...cA, ...cB, ...cB, ...cB]];
}

/**
 * Create a flattenned centroids attributes array for a corresponding flat vertices array
 * @param vertices A flat array of triangle vertices
 * @returns The flat centroids attributes array for the vertices array
 */
function makeCentroids(vertices: number[]) {
    let [xSum, ySum] = [0, 0];
    for (let i = 0; i < vertices.length; i += 2) {
        xSum += vertices[i + 0];
        ySum += vertices[i + 1];
    }
    const nVerts = vertices.length / 2;
    const [xCentre, yCentre] = [xSum / nVerts, ySum / nVerts];
    return Array.from({ length: vertices.length }, (el, i) => (i % 2 === 0 ? xCentre : yCentre));
}

/**
 * Create bounding vertices for a rectangle
 * @param b Bottom coordinate
 * @param l Left coordinate
 * @param w Rectangle width
 * @param h Rectangle height
 * @returns The rectangle bounding vertices and centroids vertex attributes
 */
export function makeRectVerts2(
    b: number,
    l: number,
    w: number,
    h: number
): [vertices: number[], centroids: number[]] {
    // Triangle vertices
    const t1 = [l, b, l, b + h, l + w / 2, b + h / 2]; // Left
    const t2 = [l, b, l + w / 2, b + h / 2, l + w, b]; // Bottom
    const t3 = [l + w, b, l + w / 2, b + h / 2, l + w, b + h]; // Right
    const t4 = [l, b + h, l + w / 2, b + h / 2, l + w, b + h]; // Top

    return [
        [...t1, ...t2, ...t3, ...t4],
        [...makeCentroids(t1), ...makeCentroids(t2), ...makeCentroids(t3), ...makeCentroids(t4)],
    ];
}

// * This had some cool effects, a bit wrong though, might revisit
// export function makeDiamondVerts(
//     b: number,
//     l: number,
//     w: number,
//     h: number
// ): [vertices: number[], centroids: number[]] {
//     // Triangle vertices
//     const t1 = [l, b + h / 2, l + w / 2, b + h, l + w, b + h / 2];
//     const t2 = [l, b + h / 2, l + w / 2, b, l + w, b + h / 2];

//     // Diamond centroids
//     const [cX, cY] = [l + w / 2, h + w / 2];

//     return [[...t1, ...t2], Array.from({ length: 12 }, (el, i) => (i % 2 === 0 ? cX : cY))];
// }

export function makeDiamondVerts(
    b: number,
    l: number,
    w: number,
    h: number
): [vertices: number[], centroids: number[]] {
    // Triangle vertices
    const t1 = [l, b + h / 2, l + w / 2, b + h, l + w, b + h / 2];
    const t2 = [l, b + h / 2, l + w / 2, b, l + w, b + h / 2];

    // Diamond centroids
    const [cX, cY] = [l + w / 2, b + h / 2];

    return [
        [...t1, ...t2],
        Array.from({ length: t1.length * 2 }, (el, i) => (i % 2 === 0 ? cX : cY)),
    ];
}

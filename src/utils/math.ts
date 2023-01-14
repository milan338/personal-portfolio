/**
 * Create a linearly-spaced array of n elements from 0 to 1
 * @param n The number of elements in the array
 * @returns The linearly-spaced array of n elements from 0 to 1
 */
export function linspace(n: number) {
    return Array.from({ length: n }, (v, i) => i / n);
}

/**
 * Create vertices and centroid attributes for a diamond
 * @param b Bottom coordinate
 * @param l Left cooordinate
 * @param w Diamond width
 * @param h Diamond height
 * @returns The flat diamond vertices array and flat centroid vertex attributes array
 */
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

    return [[...t1, ...t2], Array.from({ length: t1.length * 2 }, (el, i) => (i % 2 ? cY : cX))];
}

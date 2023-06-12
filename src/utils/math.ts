/**
 * Create vertex and centroid attributes for a diamond.
 *
 * @param b Bottom coordinate.
 * @param l Left coordinate.
 * @param w Diamond width.
 * @param h Diamond height.
 * @param vertices Flat vertex attribute array.
 * @param centroids Flat centroid attribute array.
 */
export function makeDiamondVerts(
    b: number,
    l: number,
    w: number,
    h: number,
    vertices: number[],
    centroids: number[]
) {
    vertices.push(
        // Triangle 1
        l,
        b + h / 2,
        l + w / 2,
        b + h,
        l + w,
        b + h / 2,
        // Triangle 2
        l,
        b + h / 2,
        l + w / 2,
        b,
        l + w,
        b + h / 2
    );

    const centroidX = l + w / 2;
    const centroidY = b + h / 2;

    for (let i = 0; i < 6; ++i) centroids.push(centroidX, centroidY);
}

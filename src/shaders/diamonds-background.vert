const int N_POINTS = 5;

precision mediump float;

attribute vec4 a_position;
attribute vec2 a_centroid;

uniform vec2 u_movingPoints[N_POINTS];
uniform vec2 u_cursorPos;
uniform vec2 u_resolution;
uniform float u_pixelRatio;
uniform float u_radiusScale;

/*
 * Get the scale for the diamond size based on contributions from a given point.
 *
 * @param realCentroid Diamond centroid scaled to the window dimensions.
 * @param point Point from which to calculate the distance to, e.g. mouse position.
 * @param cursor Is the point from the cursor?
 */
float getDiamondScale(vec2 realCentroid, vec2 point, bool isCursor) {
    vec2 scaledResolution = u_resolution / u_pixelRatio;
    vec2 scaledPointPos = point * scaledResolution;
    vec2 diff = abs(scaledPointPos - realCentroid);

    // Return the scale without wrapping contributions, and use a smaller radius scale
    if (isCursor) return min(1.0, length(diff) * u_radiusScale * 2.0);

    // Since the points wrap around the screen, must also find the wrapped distance
    // Wrapping occurs both horizontally and vertically across all 4 screen edges
    // Set the actual vertical and horizontal distances to the minimum of wrapped and non-wrapped
    float distHorizontal = min(diff.x, scaledResolution.x * 2.0 - diff.x);
    float distVertical = min(diff.y, scaledResolution.y * 2.0 - diff.y);

    float dist = sqrt(distHorizontal * distHorizontal + distVertical * distVertical);

    return min(1.0, dist * u_radiusScale);
}

void main() {
    vec4 diff = vec4(a_position.xy - a_centroid, 0.0, 0.0);
    vec2 scaledCentroidPos = a_centroid * u_resolution / u_pixelRatio;

    float distScale = getDiamondScale(scaledCentroidPos, u_cursorPos, true);

    for (int i = 0; i < N_POINTS; ++i)
        distScale = min(distScale, getDiamondScale(scaledCentroidPos, u_movingPoints[i], false));

    // Final vertex position is just the original vector from the centroid but scaled
    gl_Position = a_position - diff * distScale;
}

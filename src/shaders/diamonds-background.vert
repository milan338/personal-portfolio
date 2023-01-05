precision mediump float;

attribute vec4 a_position;
attribute vec2 a_centroid;

uniform vec2 u_movingPoints[3];
uniform vec2 u_cursorPos;
uniform vec2 u_resolution;
uniform float u_pixelRatio;

// uniform float u_radiusScale;
// uniform float u_maxScale;

/**
 * Get the scale for the diamond size based on contributions from a given point
 * @param realCentroid Diamond centroid scaled to the window dimensinos
 * @param point Point from which to calculate the distance to, e.g. mouse position
 * @param wrap Should the point contribute to diamonds wrapped around the screen
 */
float getDiamondScale(vec2 realCentroid, vec2 point, bool wrap) {
    // Screen resolution scaled by the device pixel ratio
    vec2 resolution = u_resolution / u_pixelRatio;

    // Get centroid and cursor positions scaled to the canvas size
    vec2 realPointPos = point * resolution;

    // Vector between the diamond centroid and point
    vec2 diff = abs(realPointPos - realCentroid);

    // Don't wrap - just return the scale without wrapping contributions
    if (!wrap) return min(1.0, length(diff) * 0.0015);

    // Since the points wrap around the screen, must also find the wrapped distance
    // Wrapping occurs both horizontally and vertically across all 4 screen edges
    // Set the actual vertical and horizontal distances to the minimum of wrapped and non-wrapped
    float distHorizontal = min(diff.x, (resolution.x * 2.0) - diff.x);
    float distVertical = min(diff.y, (resolution.y * 2.0) - diff.y);

    // The distance between the centroid and point
    float dist = sqrt((distHorizontal * distHorizontal) + (distVertical * distVertical));

    // Scale the distance between the centroid and vertex - don't scale above 1
    return min(1.0, dist * 0.0015);
}

void main() {
    // Vector between centroid and vertex
    vec4 diff = vec4(a_position.xy - a_centroid, 0.0, 0.0);

    // // Get centroid and cursor positions scaled to the canvas size
    vec2 realCentroid = (a_centroid * u_resolution) / u_pixelRatio;
    // vec2 realCurosPos = (u_cursorPos * u_resolution) / u_aspectRatio;

    // // Distance between the centroid and cursor position
    // float dist = distance(realCentroid, realCurosPos);

    // // Factor by which to scale the distance between the centroid and vertex
    // float scale = min(1.0, dist * 0.0015);

    float scale = getDiamondScale(realCentroid, u_cursorPos, false);
    // for (int i = 0; i < 3; ++i) {
    //     scale = min(scale, getScale(realCentroid, u_movingPoints[i]));
    //     // scale += getScale(realCentroid, u_movingPoints[i]);
    // }

    // Final vertex position is just the original vector from the centroid but scaled
    gl_Position = a_position - (diff * scale);
}

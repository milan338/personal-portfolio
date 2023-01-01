precision mediump float;

attribute vec4 a_position;
attribute vec2 a_texcoord;
attribute vec2 a_centroid;

varying vec2 v_texcoord;

uniform vec2 u_cursorPos;
uniform vec2 u_resolution;
uniform float u_aspectRatio;

void main() {
    v_texcoord = a_texcoord;

    // Get centroid and cursor positions scaled to the canvas size
    vec2 realCentroid = (a_centroid * u_resolution) / u_aspectRatio;
    vec2 realCurosPos = (u_cursorPos * u_resolution) / u_aspectRatio;

    // Distance between the centroid and cursor position
    float dist = distance(realCentroid, realCurosPos);

    // Vector between centroid and vertex
    vec4 diff = vec4(a_position.xy - a_centroid, 0.0, 0.0);

    // Factor by which to scale the distance between the centroid and vertex
    float scale = min(1.0, dist * 0.003);

    // Final vertex position is just the original vector from the centroid but scaled
    gl_Position = a_position - (diff * scale);
}

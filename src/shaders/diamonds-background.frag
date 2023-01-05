precision mediump float;

uniform vec4 u_color;
uniform float u_opacity;

void main() {
    gl_FragColor = vec4(u_color.xyz, u_opacity);
}

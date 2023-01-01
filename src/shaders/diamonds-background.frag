precision mediump float;

varying vec2 v_texcoord;

uniform vec4 u_color;
uniform sampler2D u_texture;

void main() {
    vec4 color = texture2D(u_texture, v_texcoord) * u_color;
    if (color.a < 0.1) discard;
    // gl_FragColor = color;
    gl_FragColor = vec4(color.xyz, 0.05);
}

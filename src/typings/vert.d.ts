declare module '*.vert' {
    import type { GlslShader } from 'webpack-glsl-minify';
    const shader: GlslShader;
    export default shader;
}

'use client';

import { useRef } from 'react';
import {
    createProgramInfo,
    setDefaults,
    resizeCanvasToDisplaySize,
    createBufferInfoFromArrays,
    drawBufferInfo,
    setBuffersAndAttributes,
    setUniforms,
} from 'twgl.js';
import type { ProgramInfo, BufferInfo, Arrays } from 'twgl.js';

export type Uniforms = Record<string, unknown>;

export type CanvasCbProps = {
    gl: WebGLRenderingContext;
    programInfo: ProgramInfo;
    bufferInfo: BufferInfo;
};

export type RenderCb = (deltaTime: number) => Uniforms;

type CanvasProps = {
    cb: (props: CanvasCbProps) => {
        renderCb: RenderCb;
        cleanupCb: () => void;
    };
    arrays: Arrays;
    vertexShader?: string;
    fragmentShader?: string;
    children?: JSX.Element;
};

setDefaults({ attribPrefix: 'a_' });

export default function Canvas(props: CanvasProps) {
    const { cb, arrays, vertexShader, fragmentShader, children } = props;
    const cleanup = useRef(() => {});

    // Run once on component mount, and once on unmount (with null)
    const withCanvas = (canvas: HTMLCanvasElement | null) => {
        // Run cleanup procedure
        if (canvas === null) {
            cleanup.current();
            return;
        }

        const gl = canvas.getContext('webgl');
        if (gl === null) return;

        const programInfo = createProgramInfo(gl, [vertexShader ?? '', fragmentShader ?? '']);
        const bufferInfo = createBufferInfoFromArrays(gl, arrays);

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        // Render loop calls render cb and requests new frame at end of current frame
        const { renderCb, cleanupCb } = cb({ gl, programInfo, bufferInfo });
        const render = (deltaTime: number) => {
            // TODO intersection observer logic here to not render when offscreen
            // TODO control this behaviour with a prop

            // Don't render frame - exit early
            // TODO have a prop to specify if should render only on mouse move
            // if (!renderFrame) {
            //     requestAnimationFrame(render);
            //     return;
            // }

            resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const uniforms = renderCb(deltaTime);

            gl.useProgram(programInfo.program);
            setBuffersAndAttributes(gl, programInfo, bufferInfo);
            setUniforms(programInfo, uniforms);
            drawBufferInfo(gl, bufferInfo);

            requestAnimationFrame(render);
        };
        // Begin render loop
        cleanup.current = cleanupCb;
        requestAnimationFrame(render);
    };

    return (
        <>
            <canvas ref={withCanvas} />
            <style jsx>{`
                /* TODO replace */
                canvas {
                    display: block;
                    width: 100%;
                    height: 100vh;
                }
            `}</style>
            {children}
        </>
    );
}

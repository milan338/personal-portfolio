'use client';

import { useEffect, useRef, useState } from 'react';
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

type RenderCallbacks = {
    renderCb: RenderCb;
};

type CanvasProps = {
    cb: (props: CanvasCbProps) => RenderCallbacks;
    arrays: Arrays;
    vertexShader?: string;
    fragmentShader?: string;
    children?: JSX.Element;
};

setDefaults({ attribPrefix: 'a_' });

export default function Canvas(props: CanvasProps) {
    const { cb, arrays, vertexShader, fragmentShader, children } = props;
    const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
    const shaders = useRef<{ vert: string; frag: string }>({ vert: '', frag: '' });
    const bufferInfo = useRef<BufferInfo | undefined>();
    const programInfo = useRef<ProgramInfo | undefined>();
    const renderCallbacks = useRef<RenderCallbacks | undefined>();
    const isCanvasVisible = useRef(true);

    // Create program and buffer info
    useEffect(() => {
        if (gl === null) return;
        if (
            programInfo.current === undefined ||
            vertexShader !== shaders.current.vert ||
            fragmentShader !== shaders.current.frag
        ) {
            programInfo.current = createProgramInfo(gl, [vertexShader ?? '', fragmentShader ?? '']);
            shaders.current = { vert: vertexShader ?? '', frag: fragmentShader ?? '' };
        }
        bufferInfo.current = createBufferInfoFromArrays(gl, arrays);
        renderCallbacks.current = cb({
            gl,
            programInfo: programInfo.current,
            bufferInfo: bufferInfo.current,
        });
    }, [gl, arrays, cb, vertexShader, fragmentShader]);

    // Initialise render loop
    useEffect(() => {
        if (gl === null || renderCallbacks.current === undefined) return;

        const { renderCb } = renderCallbacks.current;

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        // Render loop calls render cb and requests new frame at end of current frame
        const render = (deltaTime: number) => {
            if (!programInfo.current || !bufferInfo.current) return;

            resizeCanvasToDisplaySize(gl.canvas as HTMLCanvasElement, window.devicePixelRatio);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const uniforms = renderCb(deltaTime);

            gl.useProgram(programInfo.current.program);
            setBuffersAndAttributes(gl, programInfo.current, bufferInfo.current);
            setUniforms(programInfo.current, uniforms);
            drawBufferInfo(gl, bufferInfo.current);

            // Request the next frame if canvas is visible
            if (isCanvasVisible.current) requestAnimationFrame(render);
        };
        // Begin render loop
        requestAnimationFrame(render);

        // Only render while canvas on screen
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            isCanvasVisible.current = entry.isIntersecting;
            // Last state was invisible, so manually trigger a frame to restart the frameloop
            if (entry.isIntersecting) requestAnimationFrame(render);
        });
        observer.observe(gl.canvas as HTMLCanvasElement);

        // Cleanup
        return () => {
            observer.disconnect();
        };
    }, [gl]);

    // Run once on component mount, and once on unmount (with null)
    const withCanvas = (canvas: HTMLCanvasElement | null) => {
        if (canvas === null || gl !== null) return;
        setGl(canvas.getContext('webgl'));
    };

    return (
        <>
            <canvas ref={withCanvas} />
            <style jsx>{`
                /* TODO replace with not style jsx to reduce bundle sizes */
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

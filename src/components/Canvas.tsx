'use client';

import { useResizeObserver } from 'hooks/dom';
import { usePreferseReducedMotion } from 'hooks/media';
import { useEffect, useRef, useState } from 'react';
import {
    createProgramInfo,
    setDefaults,
    createBufferInfoFromArrays,
    drawBufferInfo,
    setBuffersAndAttributes,
    setUniforms,
} from 'twgl.js';
import { getDpi } from 'utils/window';
import type { Size } from 'hooks/dom';
import type { MutableRefObject } from 'react';
import type { ProgramInfo, BufferInfo, Arrays } from 'twgl.js';

export type Uniforms = Record<string, unknown>;

export type CanvasCbProps = {
    gl: WebGLRenderingContext;
    canvasSize: MutableRefObject<Size>;
    isCanvasVisible: MutableRefObject<boolean>;
};

export type RenderCb = (deltaTime: number, time: number) => Uniforms;

export type ArraysData = {
    arrays: Arrays;
    changed: boolean;
    lastWidth: number;
    lastHeight: number;
};

type RenderCallbacks = {
    renderCb: RenderCb;
    arraysData: MutableRefObject<ArraysData>;
};

type CanvasProps = {
    cb: (props: CanvasCbProps) => RenderCallbacks;
    vertexShader?: string;
    fragmentShader?: string;
    reduceMotionOnPrefer?: boolean;
    children?: JSX.Element;
};

setDefaults({ attribPrefix: 'a_' });

/**
 * Resize canvas to match its real size and factor in the device pixel ratio.
 * @param canvas The canvas to resize.
 * @see https://github.com/greggman/twgl.js/blob/master/src/twgl.js
 */
function resizeCanvasToDisplaySize(width: number, height: number, canvas: HTMLCanvasElement) {
    const dpi = getDpi();
    const [newWidth, newHeight] = [width * dpi, height * dpi];
    if (canvas.width === newWidth && canvas.height === newHeight) return;
    canvas.width = newWidth;
    canvas.height = newHeight;
}

export default function Canvas(props: CanvasProps) {
    const { cb, vertexShader, fragmentShader, reduceMotionOnPrefer, children } = props;
    const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
    const [canvasSize, observeCanvasSize] = useResizeObserver();
    const prefersReducedMotion = usePreferseReducedMotion();
    const shaders = useRef<{ vert: string; frag: string }>({ vert: '', frag: '' });
    const bufferInfo = useRef<BufferInfo>();
    const programInfo = useRef<ProgramInfo>();
    const renderCallbacks = useRef<RenderCallbacks>();
    const isCanvasVisible = useRef(true);
    const animFrameHandle = useRef<number>();
    const lastTime = useRef(0);

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
        renderCallbacks.current = cb({
            gl,
            canvasSize,
            isCanvasVisible,
        });
    }, [gl, canvasSize, cb, vertexShader, fragmentShader]);

    // Initialise render loop
    useEffect(() => {
        if (gl === null || renderCallbacks.current === undefined) return;

        const { renderCb, arraysData } = renderCallbacks.current;

        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);

        // Render loop calls render cb and requests new frame at end of current frame
        const render = (time: number) => {
            // Update buffer info if arrays have changed
            if (arraysData.current.changed) {
                arraysData.current.changed = false;
                bufferInfo.current = createBufferInfoFromArrays(gl, arraysData.current.arrays);
            }

            const { width, height } = canvasSize.current;
            resizeCanvasToDisplaySize(width, height, gl.canvas as HTMLCanvasElement);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

            gl.enable(gl.DEPTH_TEST);
            gl.enable(gl.BLEND);
            gl.blendFunc(gl.ONE, gl.ONE_MINUS_SRC_ALPHA);
            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

            const deltaTime = time - lastTime.current;
            lastTime.current = time;
            const uniforms = renderCb(deltaTime, time);

            const reduceMotion = prefersReducedMotion.current && reduceMotionOnPrefer === true;

            if (
                !reduceMotion &&
                programInfo.current !== undefined &&
                bufferInfo.current !== undefined
            ) {
                gl.useProgram(programInfo.current.program);
                setBuffersAndAttributes(gl, programInfo.current, bufferInfo.current);
                setUniforms(programInfo.current, uniforms);
                drawBufferInfo(gl, bufferInfo.current);
            }

            // Request the next frame if canvas is visible
            if (isCanvasVisible.current) animFrameHandle.current = requestAnimationFrame(render);
        };
        // Begin render loop
        animFrameHandle.current = requestAnimationFrame(render);

        // Only render while canvas on screen
        const observer = new IntersectionObserver((entries) => {
            const [entry] = entries;
            isCanvasVisible.current = entry.isIntersecting;
            // Last state was invisible, so manually trigger a frame to restart the frameloop
            if (entry.isIntersecting) animFrameHandle.current = requestAnimationFrame(render);
        });
        observer.observe(gl.canvas as HTMLCanvasElement);

        // Cleanup
        return () => {
            observer.disconnect();
            if (animFrameHandle.current !== undefined)
                cancelAnimationFrame(animFrameHandle.current);
        };
    }, [canvasSize, gl, prefersReducedMotion, reduceMotionOnPrefer]);

    // Run once on component mount, and once on unmount (with null)
    const withCanvas = (canvas: HTMLCanvasElement | null) => {
        if (canvas === null || gl !== null) return;
        setGl(canvas.getContext('webgl'));
        observeCanvasSize(canvas);
    };

    return (
        <>
            <canvas ref={withCanvas} className="block w-full h-screen" />
            {children}
        </>
    );
}

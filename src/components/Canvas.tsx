import { useResizeObserver } from 'hooks/dom';
import { usePrefersReducedMotion } from 'hooks/media';
import { useEffect, useRef, useState } from 'react';
import {
    createProgramInfo,
    setDefaults,
    createBufferInfoFromArrays,
    drawBufferInfo,
    setBuffersAndAttributes,
    setUniforms,
} from 'twgl.js';
import { resizeCanvasToDisplaySize, withIntersectionObserver } from 'utils/dom';
import { mergeRefs } from 'react-merge-refs';
import type { MutableRefObject } from 'react';
import type { ProgramInfo, BufferInfo, Arrays } from 'twgl.js';

export type Uniforms = Record<string, unknown>;

export type ArraysData<T extends Arrays> = {
    arrays: T;
    haveChanged: boolean;
    lastWidth: number;
    lastHeight: number;
};

export type OnRenderCb = (deltaTime: number, time: number, gl: WebGLRenderingContext) => Uniforms;

export type OnCreateCb = (
    size: MutableRefObject<{ width: number; height: number }>,
    isCanvasVisible: MutableRefObject<boolean>
) => void;

type CanvasProps<T extends Arrays> = {
    onRender: OnRenderCb;
    onCreate?: OnCreateCb;
    arraysData: MutableRefObject<ArraysData<T>>;
    vertexShader?: string;
    fragmentShader?: string;
    clearColor?: [r: number, g: number, b: number, a: number];
    reduceMotionOnPrefer?: boolean;
};

setDefaults({ attribPrefix: 'a_' });

export default function Canvas<T extends Arrays>({
    onRender,
    onCreate,
    arraysData,
    vertexShader,
    fragmentShader,
    clearColor,
    reduceMotionOnPrefer,
}: CanvasProps<T>) {
    const [gl, setGl] = useState<WebGLRenderingContext | null>(null);
    const [canvasSize, canvasSizeRef] = useResizeObserver();
    const prefersReducedMotion = usePrefersReducedMotion();
    const bufferInfo = useRef<BufferInfo>();
    const programInfo = useRef<ProgramInfo>();
    const isCanvasVisible = useRef(true);
    const animFrameHandle = useRef<number>();
    const lastFrameTime = useRef(0);

    useEffect(() => {
        if (!gl) return;
        programInfo.current = createProgramInfo(gl, [vertexShader ?? '', fragmentShader ?? '']);
        gl.useProgram(programInfo.current.program);
        gl.pixelStorei(gl.UNPACK_PREMULTIPLY_ALPHA_WEBGL, true);
        gl.clearColor(...(clearColor ?? [0, 0, 0, 0]));
    }, [gl, vertexShader, fragmentShader, clearColor]);

    // Initialise render loop
    useEffect(() => {
        if (!gl) return;

        const render = (time: number) => {
            const reduceMotion = prefersReducedMotion.current && reduceMotionOnPrefer;
            if (reduceMotion || !programInfo.current) {
                requestNextFrame();
                return;
            }

            if (!bufferInfo.current || arraysData.current.haveChanged) {
                arraysData.current.haveChanged = false;
                bufferInfo.current = createBufferInfoFromArrays(gl, arraysData.current.arrays);
                setBuffersAndAttributes(gl, programInfo.current, bufferInfo.current);
            }

            const { width, height } = canvasSize.current;
            resizeCanvasToDisplaySize(width, height, gl.canvas as HTMLCanvasElement);
            gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
            gl.clear(gl.COLOR_BUFFER_BIT);

            const deltaTime = time - lastFrameTime.current;
            setUniforms(programInfo.current, onRender(deltaTime, time, gl));
            drawBufferInfo(gl, bufferInfo.current);
            lastFrameTime.current = time;

            requestNextFrame();
        };

        function requestNextFrame() {
            if (isCanvasVisible.current) animFrameHandle.current = requestAnimationFrame(render);
        }

        // Begin render loop
        animFrameHandle.current = requestAnimationFrame(render);

        const observer = withIntersectionObserver(({ isIntersecting }) => {
            isCanvasVisible.current = isIntersecting;
            requestNextFrame();
        }, gl.canvas as HTMLCanvasElement);

        return () => {
            observer.disconnect();
            if (animFrameHandle.current !== undefined)
                cancelAnimationFrame(animFrameHandle.current);
        };
    }, [arraysData, canvasSize, gl, prefersReducedMotion, reduceMotionOnPrefer, onRender]);

    const canvasRef = (canvas: HTMLCanvasElement | null) => {
        if (canvas === null || gl !== null) return;
        setGl(canvas.getContext('webgl'));
    };

    if (onCreate) onCreate(canvasSize, isCanvasVisible);

    return <canvas ref={mergeRefs([canvasRef, canvasSizeRef])} className="block h-full w-full" />;
}

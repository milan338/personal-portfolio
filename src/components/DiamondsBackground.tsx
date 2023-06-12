'use client';

import { useWindowSize } from 'hooks/window';
import { useEffect, useMemo, useRef } from 'react';
import vert from 'shaders/diamonds-background.vert';
import frag from 'shaders/diamonds-background.frag';
import { createNoise3D } from 'simplex-noise';
import { makeDiamondVerts } from 'utils/math';
import { getDpi } from 'utils/window';
import Canvas from './Canvas';
import type { OnRenderCb, ArraysData, OnCreateCb } from './Canvas';

const BASE_RADIUS_SCALE = 0.001_12;
const BASE_WINDOW_WIDTH = 1920;
const N_CELLS_VERTICAL = 30;

type DiamondsBackgroundUniforms = {
    u_color: [r: number, g: number, b: number, a: number];
    u_opacity: number;
    u_cursorPos: [x: number, y: number];
    u_pixelRatio: number;
    u_radiusScale: number;
    u_resolution: [x: number, y: number];
    u_movingPoints: [
        x1: number,
        y1: number,
        x2: number,
        y2: number,
        x3: number,
        y3: number,
        x4: number,
        y4: number,
        x5: number,
        y5: number
    ];
};

type DiamondsBackgroundArrays = {
    position: { numComponents: 2; data: number[] };
    centroid: { numComponents: 2; data: number[] };
};

export default function DiamondsBackground() {
    const windowSize = useWindowSize();
    const mouseEventListener = useRef<((e: MouseEvent) => void) | undefined>();

    const uniforms = useRef<DiamondsBackgroundUniforms>({
        u_color: [0, 0, 0, 1],
        u_opacity: 0.02,
        u_cursorPos: [-9, -9],
        u_pixelRatio: 1,
        u_radiusScale: 1,
        u_resolution: [0, 0],
        u_movingPoints: [-0.7, -0.7, -0.7, 0.7, 0.7, -0.7, 0.7, 0.7, 0, 0],
    });

    const arraysData = useRef<ArraysData<DiamondsBackgroundArrays>>({
        arrays: {
            position: { numComponents: 2, data: [] },
            centroid: { numComponents: 2, data: [] },
        },
        haveChanged: false,
        lastWidth: 0,
        lastHeight: 0,
    });

    const noiseFunctions = useMemo(() => {
        return Array.from({ length: uniforms.current.u_movingPoints.length }, createNoise3D);
    }, []);

    const cleanupEventListeners = () => {
        if (!mouseEventListener.current) return;
        window.removeEventListener('mousemove', mouseEventListener.current);
        mouseEventListener.current = undefined;
    };

    const updateArrays = () => {
        const { width: windowW, height: windowH } = windowSize.current;

        if (windowW === arraysData.current.lastWidth && windowH === arraysData.current.lastHeight)
            return;

        arraysData.current.lastWidth = windowW;
        arraysData.current.lastHeight = windowH;

        arraysData.current.haveChanged = true;

        const cellSize = (windowH + 15) / N_CELLS_VERTICAL;

        const [nPointsHorizontal, nPointsVertical] = [windowW / cellSize, windowH / cellSize];
        const [hStep, vStep] = [2 / nPointsHorizontal, 2 / nPointsVertical];

        arraysData.current.arrays.position.data = [];
        arraysData.current.arrays.centroid.data = [];

        for (let i = 0; i < nPointsVertical; ++i) {
            for (let j = 0; j < nPointsHorizontal; ++j) {
                makeDiamondVerts(
                    -1 + vStep * i,
                    -1 + hStep * j,
                    hStep,
                    vStep,
                    arraysData.current.arrays.position.data,
                    arraysData.current.arrays.centroid.data
                );
            }
        }
    };

    const onRender: OnRenderCb = (deltaTime, time, gl) => {
        const dpi = getDpi();
        const baseS = BASE_RADIUS_SCALE;
        const baseW = BASE_WINDOW_WIDTH;

        const w = windowSize.current.width;
        const radScale = baseS / (Math.min(w * dpi * 1.8, baseW * dpi) / (baseW * dpi));

        uniforms.current.u_pixelRatio = dpi;
        uniforms.current.u_radiusScale = radScale;
        uniforms.current.u_resolution[0] = gl.canvas.width;
        uniforms.current.u_resolution[1] = gl.canvas.height;

        // Distance to move the point this frame
        const dist = deltaTime / 4000;
        for (let i = 0; i < noiseFunctions.length; ++i) {
            const j = 2 * i;
            const theta =
                (noiseFunctions[i + 0](
                    uniforms.current.u_movingPoints[j + 0],
                    uniforms.current.u_movingPoints[j + 1],
                    (time + 10_000) / 10_000
                ) *
                    Math.PI) %
                (2 * Math.PI);
            // Points moving around the screen randomly w.r.t. previous positions
            uniforms.current.u_movingPoints[j + 0] += dist * Math.cos(theta); // x-coordinate
            uniforms.current.u_movingPoints[j + 1] += dist * Math.sin(theta); // y-coordinate
            // Keep points in the frame
            uniforms.current.u_movingPoints[j + 0] =
                ((uniforms.current.u_movingPoints[j + 0] + 1) % 2) - 1;
            uniforms.current.u_movingPoints[j + 1] =
                ((uniforms.current.u_movingPoints[j + 1] + 1) % 2) - 1;
        }

        updateArrays();

        return uniforms.current;
    };

    const onCreate: OnCreateCb = (canvasSize, isCanvasVisible) => {
        if (typeof window === 'undefined') return;
        cleanupEventListeners();

        mouseEventListener.current = (event: MouseEvent) => {
            if (!isCanvasVisible.current) return;
            const { width, height } = canvasSize.current;
            // Assuming the canvas will be filled to fit the screen to avoid polling scroll positions
            const canvasCentreX = width / 2;
            const canvasCentreY = height;
            // Set the mouse coordinates relative to the centre of the canvas
            uniforms.current.u_cursorPos[0] = -(canvasCentreX - event.x) / (width / 2);
            uniforms.current.u_cursorPos[1] = (canvasCentreY - event.y) / (height / 2) - 1;
        };

        window.addEventListener('mousemove', mouseEventListener.current);
    };

    useEffect(() => {
        return cleanupEventListeners;
    }, []);

    return (
        <div className="fixed h-screen w-screen">
            <div
                className="h-full w-full animate-in duration-3000
                delay-300 ease-out fill-mode-both motion-safe:fade-in"
            >
                <Canvas
                    onCreate={onCreate}
                    onRender={onRender}
                    arraysData={arraysData}
                    vertexShader={vert.sourceCode}
                    fragmentShader={frag.sourceCode}
                    reduceMotionOnPrefer
                />
            </div>
        </div>
    );
}

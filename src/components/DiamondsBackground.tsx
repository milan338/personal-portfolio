'use client';

import { useWindowSize } from 'hooks/window';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import frag from 'shaders/diamonds-background.frag';
import vert from 'shaders/diamonds-background.vert';
import { createNoise3D } from 'simplex-noise';
import { makeDiamondVerts } from 'utils/math';
import { getDpi } from 'utils/window';
import Canvas from './Canvas';
import type { RenderCb, CanvasCbProps, Uniforms, ArraysData } from './Canvas';

const BASE_RADIUS_SCALE = 0.001_12;
const BASE_WINDOW_WIDTH = 1920;
const BASE_OPACITY = 0.02;
const BASE_COLOR = [0, 0, 0, 1];

export default function DiamondsBackground() {
    const mousePos = useRef<[x: number, y: number]>([-9, -9]);
    const mouseEventListener = useRef<((e: MouseEvent) => void) | undefined>();
    const uniforms = useRef<Uniforms>();
    const windowSize = useWindowSize();
    const arraysData = useRef<ArraysData>({
        arrays: {},
        changed: false,
        lastWidth: 0,
        lastHeight: 0,
    });

    const noisePoints = useRef<number[]>([-0.7, -0.7, -0.7, 0.7, 0.7, -0.7, 0.7, 0.7, 0, 0]);
    const noiseFunctions = useMemo(() => {
        return Array.from({ length: noisePoints.current.length / 2 }, () => createNoise3D());
    }, []);

    const updateArrays = useCallback(() => {
        const { width: windowW, height: windowH } = windowSize.current;

        if (windowW === arraysData.current.lastWidth && windowH === arraysData.current.lastHeight)
            return;

        arraysData.current.lastWidth = windowW;
        arraysData.current.lastHeight = windowH;

        arraysData.current.changed = true;

        const nCellsVertical = 30;
        const cellSize = (windowH + 15) / nCellsVertical;

        const [nPointsHorizontal, nPointsVertical] = [windowW / cellSize, windowH / cellSize];
        const [hStep, vStep] = [2 / nPointsHorizontal, 2 / nPointsVertical];

        const vertices: number[] = [];
        const centroids: number[] = [];

        for (let i = 0; i < nPointsVertical; i++) {
            for (let j = 0; j < nPointsHorizontal; j++) {
                const [verts, cents] = makeDiamondVerts(
                    -1 + vStep * i,
                    -1 + hStep * j,
                    hStep,
                    vStep
                );
                vertices.push(...verts);
                centroids.push(...cents);
            }
        }
        arraysData.current.arrays = {
            position: { numComponents: 2, data: vertices },
            centroid: { numComponents: 2, data: centroids },
        };
    }, [windowSize]);

    const cleanupEventListeners = () => {
        if (mouseEventListener.current !== undefined) {
            window.removeEventListener('mousemove', mouseEventListener.current);
            mouseEventListener.current = undefined;
        }
    };

    const canvasCb = useCallback(
        ({ gl, canvasSize, isCanvasVisible }: CanvasCbProps) => {
            // Remove existing event listeners
            cleanupEventListeners();

            mouseEventListener.current = (event: MouseEvent) => {
                if (!isCanvasVisible.current) return;

                const { width, height } = canvasSize.current;

                // Assuming the canvas will be filled to fit the screen to avoid polling scroll positions
                const canvasCentre = [width / 2, height];
                // Set the mouse coordinates relative to the centre of the canvas
                mousePos.current = [
                    -(canvasCentre[0] - event.x) / (width / 2),
                    (canvasCentre[1] - event.y) / (height / 2) - 1,
                ];
            };

            // Update the event listeners
            window.addEventListener('mousemove', mouseEventListener.current);

            const renderCb: RenderCb = (deltaTime, time) => {
                if (!isCanvasVisible.current) return uniforms.current ?? {};

                const dpi = getDpi();
                const baseS = BASE_RADIUS_SCALE;
                const baseW = BASE_WINDOW_WIDTH;

                if (uniforms.current === undefined) uniforms.current = {};

                const w = windowSize.current.width;
                const radScale = baseS / (Math.min(w * dpi * 1.8, baseW * dpi) / (baseW * dpi));

                const { width, height } = gl.canvas;

                uniforms.current[frag.uniforms.u_color.variableName] = BASE_COLOR;
                uniforms.current[frag.uniforms.u_opacity.variableName] = BASE_OPACITY;
                uniforms.current[vert.uniforms.u_cursorPos.variableName] = mousePos.current;
                uniforms.current[vert.uniforms.u_pixelRatio.variableName] = dpi;
                uniforms.current[vert.uniforms.u_radiusScale.variableName] = radScale;
                uniforms.current[vert.uniforms.u_resolution.variableName] = [width, height];

                // Distance to move the point this frame
                const dist = deltaTime / 4000;
                for (let i = 0; i < noiseFunctions.length; i++) {
                    const j = 2 * i;
                    const theta =
                        (noiseFunctions[i + 0](
                            noisePoints.current[j + 0],
                            noisePoints.current[j + 1],
                            (time + 10_000) / 10_000
                        ) *
                            Math.PI) %
                        (2 * Math.PI);
                    // These are points that move around the screen randomly but coherently w.r.t.
                    // Their previous positions, giving the illusion of wandering points on screen,
                    // Acting as the centres of circles that affect the diamonds through the shader,
                    // Just as with the mouse cursor
                    noisePoints.current[j + 0] += dist * Math.cos(theta); // x-coordinate
                    noisePoints.current[j + 1] += dist * Math.sin(theta); // y-coordinate
                    // Keep points in the frame
                    noisePoints.current[j + 0] = ((noisePoints.current[j + 0] + 1) % 2) - 1;
                    noisePoints.current[j + 1] = ((noisePoints.current[j + 1] + 1) % 2) - 1;
                }

                uniforms.current[vert.uniforms.u_movingPoints.variableName] = noisePoints.current;

                updateArrays();

                return uniforms.current;
            };

            return { renderCb, arraysData };
        },
        [noiseFunctions, updateArrays, windowSize]
    );

    useEffect(() => {
        // Component cleanup
        return () => {
            cleanupEventListeners();
        };
    }, []);

    return (
        <div className="fixed h-screen w-screen">
            <div className="h-full w-full animate-in duration-3000 delay-300 ease-out fill-mode-both motion-safe:fade-in">
                <Canvas
                    cb={canvasCb}
                    vertexShader={vert.sourceCode}
                    fragmentShader={frag.sourceCode}
                    reduceMotionOnPrefer
                />
            </div>
        </div>
    );
}

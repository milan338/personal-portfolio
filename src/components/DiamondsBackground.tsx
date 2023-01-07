'use client';

import { useWindowSize } from 'hooks/window';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import frag from 'shaders/diamonds-background.frag';
import vert from 'shaders/diamonds-background.vert';
import { createNoise3D } from 'simplex-noise';
import { getDpi } from 'utils/window';
import Canvas from './Canvas';
import type { Arrays } from 'twgl.js';
import type { RenderCb, CanvasCbProps, Uniforms } from './Canvas';

const BASE_RADIUS_SCALE = 0.001_12;
const BASE_WINDOW_WIDTH = 1920;
const BASE_OPACITY = 0.02;
const BASE_MAX_SCALE = 1;

/**
 * Create vertices and centroid attributes for a diamond
 * @param b Bottom coordinate
 * @param l Left cooordinate
 * @param w Diamond width
 * @param h Diamond height
 * @returns The flat diamond vertices array and flat centroid vertex attributes array
 */
function makeDiamondVerts(
    b: number,
    l: number,
    w: number,
    h: number
): [vertices: number[], centroids: number[]] {
    // Triangle vertices
    const t1 = [l, b + h / 2, l + w / 2, b + h, l + w, b + h / 2];
    const t2 = [l, b + h / 2, l + w / 2, b, l + w, b + h / 2];
    // Diamond centroids
    const [cX, cY] = [l + w / 2, b + h / 2];

    return [[...t1, ...t2], Array.from({ length: t1.length * 2 }, (el, i) => (i % 2 ? cY : cX))];
}

export default function DiamondsBackground() {
    const mousePos = useRef<[x: number, y: number]>([-9, -9]);
    const realMousePos = useRef<[x: number, y: number]>([-9, -9]);
    const mouseEventListener = useRef<((e: MouseEvent) => void) | undefined>();
    const uniforms = useRef<Uniforms>();
    const lastTime = useRef(0);
    const [windowW, windowH] = useWindowSize();

    const noisePoints = useRef<number[]>([-0.7, -0.7, -0.7, 0.7, 0.7, -0.7, 0.7, 0.7, 0, 0]);
    const noiseFunctions = useMemo(() => {
        return Array.from({ length: noisePoints.current.length / 2 }, () => createNoise3D());
    }, []);

    const arrays = useMemo(() => {
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

        const arr: Arrays = {
            position: { numComponents: 2, data: vertices },
            centroid: { numComponents: 2, data: centroids },
        };

        return arr;
    }, [windowW, windowH]);

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
                // Update the actual mouse coordinates for use in the scroll listener
                realMousePos.current = [event.x, event.y];
            };

            // Update the event listeners
            window.addEventListener('mousemove', mouseEventListener.current);

            const renderCb: RenderCb = (deltaTime) => {
                if (!isCanvasVisible.current) return uniforms.current ?? {};

                const frameTime = deltaTime - lastTime.current;
                lastTime.current = deltaTime;

                const dpi = getDpi();
                const baseS = BASE_RADIUS_SCALE;
                const baseW = BASE_WINDOW_WIDTH;

                if (uniforms.current === undefined) uniforms.current = {};

                const radScale =
                    baseS / (Math.min(windowW * dpi * 1.8, baseW * dpi) / (baseW * dpi));

                uniforms.current[frag.uniforms.u_color.variableName] = [0, 0, 0, 1];
                uniforms.current[frag.uniforms.u_opacity.variableName] = BASE_OPACITY;
                uniforms.current[vert.uniforms.u_cursorPos.variableName] = mousePos.current;
                uniforms.current[vert.uniforms.u_pixelRatio.variableName] = dpi;
                uniforms.current[vert.uniforms.u_maxScale.variableName] = BASE_MAX_SCALE;
                uniforms.current[vert.uniforms.u_radiusScale.variableName] = radScale;
                uniforms.current[vert.uniforms.u_resolution.variableName] = [
                    gl.canvas.width,
                    gl.canvas.height,
                ];

                // Distance to move the point this frame
                const dist = frameTime / 3000;
                for (let i = 0; i < noiseFunctions.length; i++) {
                    const j = 2 * i;
                    const theta =
                        noiseFunctions[i + 0](
                            noisePoints.current[j + 0],
                            noisePoints.current[j + 1],
                            (deltaTime + 10_000) / 10_000
                        ) * Math.PI;
                    noisePoints.current[j + 0] += dist * Math.cos(theta); // x-coordinate
                    noisePoints.current[j + 1] += dist * Math.sin(theta); // y-coordinate
                    // Keep points in the frame
                    noisePoints.current[j + 0] = ((noisePoints.current[j + 0] + 1) % 2) - 1;
                    noisePoints.current[j + 1] = ((noisePoints.current[j + 1] + 1) % 2) - 1;
                }

                uniforms.current[vert.uniforms.u_movingPoints.variableName] = noisePoints.current;

                return uniforms.current;
            };

            return { renderCb };
        },
        [noiseFunctions, windowW]
    );

    useEffect(() => {
        // Component cleanup
        return () => {
            cleanupEventListeners();
        };
    }, []);

    return (
        <div className="diamonds-background">
            <Canvas
                cb={canvasCb}
                arrays={arrays}
                vertexShader={vert.sourceCode}
                fragmentShader={frag.sourceCode}
            />
            <style jsx>{`
                @keyframes fade-in {
                    0% {
                        opacity: 0;
                    }

                    100% {
                        opacity: 1;
                    }
                }

                .diamonds-background {
                    animation: fade-in 1s ease forwards;
                    opacity: 0;
                }
            `}</style>
        </div>
    );
}

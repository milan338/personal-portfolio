'use client';

import { useWindowSize } from 'hooks/window';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import frag from 'shaders/diamonds-background.frag';
import vert from 'shaders/diamonds-background.vert';
import { withBoundingClientRect } from 'utils/dom';
import { getDpi } from 'utils/window';
import Canvas from './Canvas';
import type { Arrays } from 'twgl.js';
import type { RenderCb, CanvasCbProps, Uniforms } from './Canvas';

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
    const mousePos = useRef<[x: number, y: number]>([-1, -1]);
    const realMousePos = useRef<[x: number, y: number]>([-1, -1]);
    const mouseEventListener = useRef<((e: MouseEvent) => void) | undefined>();
    const scrollEventListener = useRef<((e: Event) => void) | undefined>();
    const uniforms = useRef<Uniforms>();
    const [windowW, windowH] = useWindowSize();

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
        if (scrollEventListener.current !== undefined) {
            window.removeEventListener('scroll', scrollEventListener.current);
            scrollEventListener.current = undefined;
        }
    };

    const canvasCb = useCallback(
        (canvasCbProps: CanvasCbProps) => {
            const { gl } = canvasCbProps;

            // TODO remove the event listeners when not rendering a frame
            // TODO or just pass in isRendering as a live data and just early break out the listeners if set to true

            // Remove existing event listeners
            cleanupEventListeners();

            mouseEventListener.current = (event: MouseEvent) => {
                withBoundingClientRect(({ bottom, left, width, height }) => {
                    const canvasCentre = [(left + width) / 2, (bottom + height) / 2];

                    // Amount of scroll
                    const diff = (windowH - bottom) / 2;

                    // Set the mouse coordinates relative to the centre of the canvas
                    mousePos.current = [
                        -(canvasCentre[0] - event.x) / (width / 2),
                        (canvasCentre[1] - (event.y + diff)) / (height / 2) - 1,
                    ];

                    // Update the actual mouse coordinates for use in the scroll listener
                    realMousePos.current = [event.x, event.y];
                }, gl.canvas as HTMLCanvasElement);
            };

            // Force an update of the relative cursor coordinates upon scroll
            scrollEventListener.current = () => {
                const event = new MouseEvent('mousemove', {
                    clientX: realMousePos.current[0],
                    clientY: realMousePos.current[1],
                });
                window.dispatchEvent(event);
            };

            // Update the event listeners
            window.addEventListener('mousemove', mouseEventListener.current);
            window.addEventListener('scroll', scrollEventListener.current);

            const renderCb: RenderCb = () => {
                if (uniforms.current === undefined) uniforms.current = {};
                uniforms.current[frag.uniforms.u_color.variableName] = [0, 0, 0, 1];
                uniforms.current[vert.uniforms.u_cursorPos.variableName] = mousePos.current;
                uniforms.current[vert.uniforms.u_resolution.variableName] = [
                    gl.canvas.width,
                    gl.canvas.height,
                ];
                uniforms.current[vert.uniforms.u_aspectRatio.variableName] = getDpi();

                return uniforms.current;
            };

            return { renderCb };
        },
        [windowH]
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
                    animation: fade-in 1s ease;
                }
            `}</style>
        </div>
    );
}

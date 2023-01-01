'use client';

import { useWindowSize } from 'hooks/window';
import { useCallback, useEffect, useMemo, useRef } from 'react';
import frag from 'shaders/background.frag';
import vert from 'shaders/background.vert';
import { createTexture } from 'twgl.js';
import { makeCanvasText } from 'utils/canvas';
import { withBoundingClientRect } from 'utils/dom';
import { makeDiamondVerts } from 'utils/render';
import { getDpi } from 'utils/window';
import Canvas from './Canvas';
import type { Arrays } from 'twgl.js';
import type { RenderCb, CanvasCbProps, Uniforms } from './Canvas';

type NameProps = {
    nameText: string;
};

export default function DiamondsBackground(props: NameProps) {
    const { nameText } = props;
    const mousePos = useRef<[x: number, y: number]>([0, 0]);
    const realMousePos = useRef<[x: number, y: number]>([0, 0]);
    const mouseEventListener = useRef<((e: MouseEvent) => void) | undefined>();
    const scrollEventListener = useRef<((e: Event) => void) | undefined>();
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

            const nameTextCanvas = makeCanvasText(nameText, 20, 'sans-serif', 300, 300); // TODO width / height props?
            const texture = createTexture(gl, { src: nameTextCanvas });

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
                const uniforms: Uniforms = {
                    // TODO remove the 2d texture sampling, since not using any text effects any more

                    [frag.uniforms.u_texture.variableName]: texture,
                    // u_color: [0, 0, 1, 1],
                    // u_color: [30 / 255, 31 / 255, 32 / 255, 1],
                    // [frag.uniforms.u_color.variableName]: [60 / 255, 61 / 255, 62 / 255, 1],
                    [frag.uniforms.u_color.variableName]: [0, 0, 0, 1],
                    [vert.uniforms.u_cursorPos.variableName]: mousePos.current,
                    [vert.uniforms.u_resolution.variableName]: [gl.canvas.width, gl.canvas.height],
                    [vert.uniforms.u_aspectRatio.variableName]: getDpi(),
                };
                return uniforms;
            };

            return { renderCb };
        },
        [nameText, windowH]
    );

    useEffect(() => {
        // Component cleanup
        return () => {
            cleanupEventListeners();
        };
    }, []);

    return (
        <div>
            <Canvas
                cb={canvasCb}
                arrays={arrays}
                vertexShader={vert.sourceCode}
                fragmentShader={frag.sourceCode}
            />
        </div>
    );
}

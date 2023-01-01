import { getDpi } from './window';

/**
 * Create a canvas that won't be blurry
 * @param width Canvas width
 * @param height Canvas height
 * @returns The high-dpi canvas
 * @see https://stackoverflow.com/a/65124939
 */
export function createHiDpiCanvas(width: number, height: number) {
    const ratio = getDpi();
    const canvas = document.createElement('canvas');

    canvas.width = width * ratio;
    canvas.height = height * ratio;
    canvas.style.width = `${width}px`;
    canvas.style.height = `${height}px`;

    const ctx = canvas.getContext('2d');
    if (!ctx) throw new Error('Failed to get canvas 2d context');

    ctx.scale(ratio, ratio);

    return canvas;
}

/**
 * Get a canvas with text drawn to it
 * @param text The text string to draw
 * @param width The width of the canvas
 * @param height The height of the canvas
 * @returns The canvas with the text drawn
 */
export function makeCanvasText(
    text: string,
    fontSizePx: number,
    fontFamily: string,
    width: number,
    height: number,
    fitWidthToText = false
) {
    const ctx = createHiDpiCanvas(width, height).getContext('2d');
    if (ctx === null) throw new Error('Failed to create canvas 2d context');

    const font = `${fontSizePx}px ${fontFamily}`;
    ctx.font = font;

    if (fitWidthToText) {
        const textMetrics = ctx.measureText(text);
        ctx.canvas.width = Math.ceil(textMetrics.width) + 1;
        ctx.canvas.height = height;
        ctx.font = font;
    }

    ctx.fillStyle = 'white';
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    // ctx.fillText(text, Math.floor(ctx.canvas.width / 2), Math.floor(ctx.canvas.height));
    // ctx.fillText(text, 0, 0);
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
    return ctx.canvas;
}

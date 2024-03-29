import { getDpi } from './window';

type ResizeObserverCb = (size: { width: number; height: number }) => void;
type IntersectionObserverCb = (entry: IntersectionObserverEntry) => void;

/**
 * Create a new resize observer that will call the given callback function on element resize.
 *
 * @param cb The callback function to be run on element resize.
 * @param node The node whose size to observe.
 * @returns The new resize observer. Must disconnect or unobserve eventually to release resources.
 */
export function withResizeObserver(cb: ResizeObserverCb, node: Element | null) {
    const observer = new ResizeObserver((entries) => {
        const [entry] = entries;
        const { inlineSize, blockSize } = entry.contentBoxSize[0];
        cb({ width: inlineSize, height: blockSize });
    });

    if (node !== null) observer.observe(node);

    return observer;
}

/**
 * Create a new intersection observer that will call the given callback function on a Change in
 * intersection ratio of the element.
 *
 * @param cb The callback function to be run on intersection ratio update.
 * @param node The node whose intersection ratio to observe.
 * @param options Optional intersection observer options.
 * @returns The new intersection observer. Must disconnect or unobserve eventually to release
 *   resources.
 */
export function withIntersectionObserver(
    cb: IntersectionObserverCb,
    node: Element | null,
    options?: IntersectionObserverInit
) {
    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        cb(entry);
    }, options);

    if (node !== null) observer.observe(node);

    return observer;
}

/**
 * Resize canvas to match its real size and factor in the device pixel ratio.
 *
 * @param width The canvas width.
 * @param height The canvas height.
 * @param canvas The canvas to resize.
 * @see https://github.com/greggman/twgl.js/blob/master/src/twgl.js
 */
export function resizeCanvasToDisplaySize(
    width: number,
    height: number,
    canvas: HTMLCanvasElement
) {
    const dpi = getDpi();
    const [newWidth, newHeight] = [width * dpi, height * dpi];

    if (canvas.width === newWidth && canvas.height === newHeight) return;

    canvas.width = newWidth;
    canvas.height = newHeight;
}

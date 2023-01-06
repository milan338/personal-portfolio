type ResizeObserverCb = (size: { width: number; height: number }) => void;

/**
 * Create a new resize observer that will call the given callback function on element resize.
 * @param cb The callback function to be run on element resize.
 * @param node The node whose size to observe.
 * @returns The new resize observer. Must disconnect or unobserve eventually to release resources.
 */
export function withResizeObserver(cb: ResizeObserverCb, node: Element) {
    const observer = new ResizeObserver((entries) => {
        const [entry] = entries;
        const { inlineSize, blockSize } = entry.contentBoxSize[0];
        cb({ width: inlineSize, height: blockSize });
    });
    observer.observe(node);
    return observer;
}

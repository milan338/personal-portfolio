/**
 * Use an element's bounding client without forcing a reflow
 * @param cb The callback function that receives the node's boundingClientRect
 * @param node The DOM node to get the boundingClientRect from
 */
export function withBoundingClientRect(cb: (rect: DOMRectReadOnly) => void, node: Element) {
    const observer = new IntersectionObserver((entries) => {
        const [entry] = entries;
        cb(entry.boundingClientRect);
        observer.disconnect();
    });
    observer.observe(node);
}

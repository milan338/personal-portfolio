import { useEffect, useRef } from 'react';
import { withIntersectionObserver, withResizeObserver } from 'utils/dom';
import { linspace } from 'utils/math';
import type { MutableRefObject } from 'react';

export type Size = { width: number; height: number };

type ResizeObserverCb = (entry: Size) => void;

/**
 * Custom React hook to get the current size of a DOM element.
 * Stores the size in a ref so doesn't cause component rerenders.
 * @returns The current element size, and a callback to set the element to observe.
 */
export function useResizeObserver(
    cb?: ResizeObserverCb
): [MutableRefObject<Size>, (element: Element) => void] {
    const size = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
    const observer = useRef<ResizeObserver>();
    const currentElement = useRef<Element>();

    useEffect(() => {
        observer.current?.disconnect();

        observer.current = withResizeObserver((entry) => {
            size.current.width = entry.width;
            size.current.height = entry.height;
            if (cb !== undefined) cb(entry);
        }, null);

        if (currentElement.current !== undefined) observer.current.observe(currentElement.current);

        // Cleanup on component unmount
        return () => {
            if (observer.current !== undefined) observer.current.disconnect();
        };
    }, [cb]);

    const observeSize = (element: Element) => {
        currentElement.current = element;
        observer.current?.disconnect();
        observer.current?.observe(element);
    };

    return [size, observeSize];
}

/**
 * Custom React hook to get the current scroll amount of a DOM element.
 * Stores the scroll amount in a ref so doesn't cause component rerenders.
 * @param element The element to observe, or a document query string pointing to the element.
 * @param precision The number of steps for triggering a scroll change, e.g. for precision === 10,
 * The scroll amount will be updated on 0.1%, 0.2%, ..., 0.9%, 1% scroll.
 * @returns The current scroll amount of the element.
 */
export function useScrollAmount(element: Element | string, precision: number) {
    const observer = useRef<IntersectionObserver>();
    const scrollAmount = useRef(0);
    const currentElement = useRef<Element>();

    const [, observeSize] = useResizeObserver(({ height }) => {
        // Remove any existing observer
        observer.current?.disconnect();

        // Create a new observer
        observer.current = withIntersectionObserver(
            ({ boundingClientRect }) => (scrollAmount.current = Math.abs(boundingClientRect.top)),
            null,
            { threshold: linspace(precision), rootMargin: `${height / 2}px` }
        );

        if (currentElement.current !== undefined) observer.current.observe(currentElement.current);
    });

    useEffect(() => {
        // Get the element if given as a query string
        const node = typeof element === 'string' ? document.querySelector(element) : element;
        // Update the node to be observed
        if (node !== null) {
            observeSize(node);
            currentElement.current = node;
            observer.current?.disconnect();
            observer.current?.observe(currentElement.current);
        }
    }, [element, observeSize]);

    return scrollAmount;
}

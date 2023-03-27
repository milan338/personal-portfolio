import { useEffect, useRef } from 'react';
import { withResizeObserver } from 'utils/dom';

export type Size = { width: number; height: number };

type ResizeObserverCb = (entry: Size) => void;
type MouseDownCb = (event: MouseEvent) => void;

/**
 * Custom React hook to get the current size of a DOM element. Stores the size in a ref so doesn't
 * cause component rerenders.
 *
 * @returns The current element size, and a callback to set the element to observe.
 */
export function useResizeObserver(cb?: ResizeObserverCb) {
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

    return [size, observeSize] as const;
}

/**
 * Custom React hook to run a callback whenever the user presses the mouse.
 *
 * @param cb The callback function to run on mousedown.
 */
export function useMouseDown(cb: MouseDownCb) {
    useEffect(() => {
        document.addEventListener('mousedown', cb);
        return () => document.removeEventListener('mousedown', cb);
    }, [cb]);
}

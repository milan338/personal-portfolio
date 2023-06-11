import { useEffect, useRef } from 'react';
import { withResizeObserver } from 'utils/dom';

export type Size = { width: number; height: number };

/**
 * Custom React hook to get the current size of a DOM element. Stores the size in a ref so doesn't
 * cause component rerenders.
 *
 * @returns The current element size, and a callback ref to be set on the element whose size should
 *   be observed.
 */
export function useResizeObserver(cb?: (entry: Size) => void) {
    const size = useRef<Size>({ width: 0, height: 0 });
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

    const ref = (element: HTMLElement | null) => {
        observer.current?.disconnect();
        if (element === null) return;
        currentElement.current = element;
        observer.current?.observe(element);
    };

    return [size, ref] as const;
}

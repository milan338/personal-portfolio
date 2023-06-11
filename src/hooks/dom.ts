import { useEffect, useRef } from 'react';
import { withResizeObserver } from 'utils/dom';

type UseResizeObserverCb = (width: number, height: number) => void;

/**
 * Custom React hook to get the current size of a DOM element, up to date across resizes. Does not
 * cause component rerenders.
 *
 * @param cb An optional callback to run whenever the size of the element changes.
 * @returns The current element size, and a ref to be set on the element whose size to observe.
 */
export function useResizeObserver(cb?: UseResizeObserverCb) {
    const size = useRef({ width: 0, height: 0 });
    const observer = useRef<ResizeObserver>();
    const currentElement = useRef<Element>();

    useEffect(() => {
        observer.current?.disconnect();

        observer.current = withResizeObserver((entry) => {
            size.current.width = entry.width;
            size.current.height = entry.height;
            if (cb) cb(entry.width, entry.height);
        }, null);

        if (currentElement.current) observer.current.observe(currentElement.current);

        // Cleanup on component unmount
        return () => observer.current?.disconnect();
    }, [cb]);

    const ref = (element: HTMLElement | null) => {
        observer.current?.disconnect();

        if (element === null) return;

        currentElement.current = element;
        observer.current?.observe(element);
    };

    return [size, ref] as const;
}

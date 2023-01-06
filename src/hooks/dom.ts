import { useEffect, useRef, useState } from 'react';
import { withResizeObserver } from 'utils/dom';
import type { MutableRefObject } from 'react';

export type Size = { width: number; height: number };

/**
 * Custom React hook to get the current size of a DOM element.
 * Stores the size in a ref so doesn't cause component rerenders.
 * @returns The current element size, and a callback to set the element to observe (the
 * callback will rerender the component each time it is run to set the element).
 */
export function useResizeObserver(): [MutableRefObject<Size>, (node: Element) => void] {
    const [node, setNode] = useState<Element>();
    const size = useRef<{ width: number; height: number }>({ width: 0, height: 0 });
    const observer = useRef<ResizeObserver>();

    useEffect(() => {
        if (node === undefined) return;
        if (observer.current !== undefined) observer.current.disconnect();
        observer.current = withResizeObserver(({ width, height }) => {
            size.current.width = width;
            size.current.height = height;
        }, node);
        // Cleanup on component unmount
        return () => {
            if (observer.current !== undefined) observer.current.disconnect();
        };
    }, [node]);

    const observeSize = (nodeToObserve: Element) => {
        setNode(nodeToObserve);
    };

    return [size, observeSize];
}

import { useEffect, useState } from 'react';
import { withResizeObserver } from 'utils/dom';

type WindowSize = [width: number, height: number];

/**
 * Custom React hook to get the current window size.
 * Will cause a component rerender whenever the window size changes.
 * @returns The current window dimensions.
 */
export function useWindowSize() {
    const [windowSize, setWindowSize] = useState<WindowSize>([-1, -1]);

    useEffect(() => {
        // Can't observe the document.body element since it will give the wrong height
        const windowSizeElement = document.querySelector('#window-size');
        if (windowSizeElement === null) throw new Error('Failed to get window size');

        // Resize observer correctly identifies resizes where window.addEventListener('resize', cb) fails to
        const observer = withResizeObserver(({ width, height }) => {
            setWindowSize([width, height]);
        }, windowSizeElement);

        return () => observer.unobserve(windowSizeElement);
    }, []);

    // Avoid SSR errors
    if (typeof window === 'undefined') return [0, 0];

    // Cause single reflow on component mount to get initial width / height
    if (windowSize[0] === -1 && windowSize[1] === -1)
        setWindowSize([
            document.documentElement.clientWidth,
            document.documentElement.clientHeight,
        ]);

    return windowSize;
}

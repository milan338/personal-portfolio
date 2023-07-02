import { useEffect, useRef } from 'react';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';
import { withResizeObserver } from 'utils/dom';

let WINDOW_SIZE_ELEMENT: HTMLDivElement | undefined;

/**
 * Custom React hook to get the current window size. Does not cause component rerenders.
 *
 * @returns The current window dimensions.
 */
export function useWindowSize() {
    const size = useRef({ width: 0, height: 0 });

    useEffect(() => {
        if (!WINDOW_SIZE_ELEMENT) {
            WINDOW_SIZE_ELEMENT = document.createElement('div');
            WINDOW_SIZE_ELEMENT.classList.add(
                'invisible',
                'absolute',
                'top-0',
                '-z-50',
                'h-screen',
                'w-screen'
            );
            document.querySelector('body')?.append(WINDOW_SIZE_ELEMENT);
        }

        // Resize observer correctly identifies resizes where window.addEventListener('resize', cb) fails to
        const observer = withResizeObserver(({ width, height }) => {
            size.current.width = width;
            size.current.height = height;
        }, WINDOW_SIZE_ELEMENT);

        return () => observer.disconnect();
    }, []);

    return size;
}

/**
 * Custom React hook to disable scrolling from all elements apart from the current element.
 *
 * @returns A ref to be set on the element that should be selected for scrolling, and callbacks to
 *   enable and disable scrolling.
 */
export function usePreventScroll() {
    const targetRef = useRef<HTMLElement>(null);

    useEffect(() => {
        return clearBodyLocks;
    }, []);

    const enableScroll = () => {
        if (!targetRef.current) return;
        unlock(targetRef.current);
    };

    const disableScroll = () => {
        if (!targetRef.current) return;
        lock(targetRef.current);
    };

    return [targetRef, enableScroll, disableScroll] as const;
}

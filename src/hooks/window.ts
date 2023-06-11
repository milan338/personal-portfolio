import { useEffect, useRef } from 'react';
import { withResizeObserver } from 'utils/dom';
import { lock, unlock, clearBodyLocks } from 'tua-body-scroll-lock';

/**
 * Custom React hook to get the current window size. Does not cause component rerenders, so must be
 * used outside of React, e.g. In event listeners and animation frames.
 *
 * @returns The current window dimensions.
 */
export function useWindowSize() {
    const size = useRef({ width: 0, height: 0 });

    useEffect(() => {
        // Can't observe the document.body element since it will give the wrong height
        const windowSizeElement = document.querySelector('#window-size');
        if (windowSizeElement === null) throw new Error('Failed to get window size');

        // Resize observer correctly identifies resizes where window.addEventListener('resize', cb) fails to
        const observer = withResizeObserver(({ width, height }) => {
            size.current.width = width;
            size.current.height = height;
        }, windowSizeElement);

        return () => observer.disconnect();
    }, []);

    return size;
}

/**
 * Custom React hook to disable scrolling from all elements apart from the current element.
 *
 * @returns A ref to be set on the element that should be selected for scrolling, and callbacks to
 *   enable and disable scrolling
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

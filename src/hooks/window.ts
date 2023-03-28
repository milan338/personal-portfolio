import { useEffect, useRef } from 'react';
import { withResizeObserver } from 'utils/dom';
import { disableBodyScroll, enableBodyScroll, clearAllBodyScrollLocks } from 'body-scroll-lock';

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
 * @param prevent Should scrolling be prevented or not?
 * @returns A ref to be set on the element that should be selected for scrolling.
 */
export function usePreventScroll(prevent: boolean) {
    const targetRef = useRef<HTMLElement>(null);

    useEffect(() => {
        if (targetRef.current === null) return;
        if (prevent) disableBodyScroll(targetRef.current);
        else enableBodyScroll(targetRef.current);

        return clearAllBodyScrollLocks;
    }, [prevent]);

    return targetRef;
}

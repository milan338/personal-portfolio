import { useEffect, useRef } from 'react';

type UseMediaQueryCb = (matches: boolean) => void;

/**
 * Custom React hook to get the current result of matching a media query. Does not cause component
 * rerenders.
 *
 * @param query The media query string to match.
 * @param cb A callback to run on query match change.
 * @returns The current result of matching the media query.
 */
export function useMediaQuery(query: string, cb?: UseMediaQueryCb) {
    const matches = useRef(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        matches.current = mediaQuery.matches;

        const listener = (event: MediaQueryListEvent) => {
            matches.current = event.matches;
            if (cb) cb(event.matches);
        };

        mediaQuery.addEventListener('change', listener);

        return () => mediaQuery.removeEventListener('change', listener);
    }, [cb]);

    return matches;
}

/**
 * Custom React hook to get if the user prefers reduced motion. Does not cause component rerenders.
 *
 * @param cb A callback to run on query match change.
 * @returns The current state of if the user prefers reduced motion.
 */
export function usePrefersReducedMotion(cb?: UseMediaQueryCb) {
    return useMediaQuery('(prefers-reduced-motion: reduce)', cb);
}

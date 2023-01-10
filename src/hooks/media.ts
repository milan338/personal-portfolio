import { useEffect, useRef } from 'react';

/**
 * Custom React hook to get the current result of matching a media query
 * Does not cause component rerenders
 * @param query The media query string to match
 * @returns The current result of matching the media query
 */
export function useMediaQuery(query: string) {
    const matches = useRef(false);

    useEffect(() => {
        const mediaQuery = window.matchMedia(query);
        matches.current = mediaQuery.matches;

        const listener = (event: MediaQueryListEvent) => {
            matches.current = event.matches;
        };

        mediaQuery.addEventListener('change', listener);

        return () => {
            mediaQuery.removeEventListener('change', listener);
        };
    });

    return matches;
}

/**
 * Custom React hook to get if the user prefers reduced motion
 * @returns The current state of if the user prefers reduced motion
 */
export function usePreferseReducedMotion() {
    return useMediaQuery('(prefers-reduced-motion: reduce)');
}

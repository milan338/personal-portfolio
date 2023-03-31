export const DEV = process.env.NODE_ENV !== 'production';

export const ANALYTICS_SRC = DEV
    ? 'https://cdn.vercel-insights.com/v1/script.debug.js'
    : '/_vercel/insights/script.js';

/**
 * Get the current window's device pixel ratio.
 *
 * @returns The window's device pixel ratio.
 */
export function getDpi() {
    // Cap the DPI at 2, since some mobile displays go to higher values such as 4 which
    // May seriously slow down performance due to the number of pixels
    return Math.min(window.devicePixelRatio, 2);
}

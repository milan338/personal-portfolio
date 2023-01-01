/**
 * Get the current window's device pixel ratio
 * @returns The window's device pixel ratio
 */
export function getDpi() {
    // Cap the DPI at 2, since some mobile displays go to higher values such as 4 which
    // May seriously slow down performance due to the number of pixels
    return Math.min(window.devicePixelRatio, 2);
}

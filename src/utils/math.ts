/**
 * Create a linearly-spaced array of n elements from 0 to 1
 * @param n The number of elements in the array
 * @returns The linearly-spaced array of n elements from 0 to 1
 */
export function linspace(n: number) {
    return Array.from({ length: n }, (v, i) => i / n);
}

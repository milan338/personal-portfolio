import { trustedTypes } from 'trusted-types';

export const DEV = process.env.NODE_ENV !== 'production';

export const ANALYTICS_SRC = DEV
    ? 'https://cdn.vercel-insights.com/v1/script.debug.js'
    : '/_vercel/insights/script.js';

let POLICY: TrustedTypePolicy | undefined;

const TRUSTED_SCRIPT_URLS = new Set([ANALYTICS_SRC]);

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

/**
 * Get the trusted types policy, which will be created if it doesn't already exist
 *
 * @returns The trusted types policy.
 */
export async function getTrustedTypesPolicy() {
    const dompurify = await import('dompurify');
    if (POLICY !== undefined) return POLICY;
    POLICY = trustedTypes.createPolicy('default', {
        createHTML: (html) => dompurify.sanitize(html),
        createScript: () => '',
        createScriptURL: (url) => (TRUSTED_SCRIPT_URLS.has(url) ? url : ''),
    });
    return POLICY;
}

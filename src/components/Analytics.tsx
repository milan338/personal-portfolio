import Script from 'next/script';
import { DEV } from 'utils/window';

const ANALYTICS_SRC = DEV
    ? 'https://cdn.vercel-insights.com/v1/script.debug.js'
    : '/_vercel/insights/script.js';

const ANALYTICS_INTEGRITY = DEV ? undefined : process.env.ANALYTICS_INTEGRITY;

export default function Analytics() {
    return (
        <Script
            src={ANALYTICS_SRC}
            integrity={ANALYTICS_INTEGRITY}
            strategy="lazyOnload"
            crossOrigin="anonymous"
            async
            defer
        />
    );
}

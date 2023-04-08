import { DEV } from 'utils/window';
import Script from 'next/script';

const ANALYTICS_SRC = DEV
    ? 'https://cdn.vercel-insights.com/v1/script.debug.js'
    : '/_vercel/insights/script.js';

const ANALYTICS_INTEGRITY = DEV
    ? 'sha512-+ELKecaEcLta4OSaZdoj6J1RPTyDI1LgtDnt/Yq5nMbDtOdE+TieuKOL5Mb7NZ465WUCwyut9DO3DgeOisgqDQ=='
    : 'sha512-sXFK4flWBTfuIKZUf9WqzwL9ot/NFoQnLQEwvAJbdDe4I9ICNpzZztdBo1clxh8jRjtWtZrbpiuDJqR2+5EBKQ==';

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

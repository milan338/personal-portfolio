import content from '@content/hero.content';
import type { MetadataRoute } from 'next';

export default function robots(): MetadataRoute.Robots {
    const { url } = content;

    return {
        rules: [
            {
                userAgent: '*',
            },
        ],
        sitemap: `${url}/sitemap.xml`,
        host: url,
    };
}

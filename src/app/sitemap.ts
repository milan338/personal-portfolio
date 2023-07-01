import content from '@content/hero.content';
import type { MetadataRoute } from 'next';
import { PATHS } from 'utils/route';

export default function sitemap(): MetadataRoute.Sitemap {
    const { url } = content;

    return Object.keys(PATHS).map((route) => ({
        url: `${url}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
    }));
}

import content from '@content/hero.content';
import { PATHS } from 'utils/route';
import type { MetadataRoute } from 'next';

export default function sitemap(): MetadataRoute.Sitemap {
    const { url } = content;

    return Object.keys(PATHS).map((route) => ({
        url: `${url}${route}`,
        lastModified: new Date().toISOString().split('T')[0],
    }));
}

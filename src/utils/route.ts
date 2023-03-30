import projectsContent from '@content/projects.content';
import aboutContent from '@content/about.content';
import heroContent from '@content/hero.content';
import type { Metadata } from 'next';

export const PATHS = {
    '/': projectsContent.heading,
    '/projects': projectsContent.heading,
    '/about': aboutContent.heading,
} as const;

export const TITLES = {
    '/': projectsContent.title,
    '/projects': projectsContent.title,
    '/about': aboutContent.title,
};

/**
 * Get the og image for the current route, for use in page metadata.
 *
 * @param routeName The name of the current route.
 * @returns The og image for the current route.
 */
export function getOgImage(routeName: string) {
    const res: Exclude<Metadata['openGraph'], null | undefined>['images'] = {
        url: new URL(`api/og?title=${routeName}`, heroContent.url).toString(),
        width: 1920,
        height: 1080,
    };
    return res;
}

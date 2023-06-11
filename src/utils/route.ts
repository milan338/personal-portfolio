import projectsContent from '@content/projects.content';
import aboutContent from '@content/about.content';
import heroContent from '@content/hero.content';
import type { Metadata } from 'next';

export const PATHS = {
    '/': { heading: projectsContent.heading, title: projectsContent.title, id: 0 },
    '/projects': { heading: projectsContent.heading, title: projectsContent.title, id: 0 },
    '/about': { heading: aboutContent.heading, title: aboutContent.title, id: 1 },
} as const;

/**
 * Get the og image for the current route, for use in page metadata.
 *
 * @param routeName The name of the current route.
 * @returns The og image for the current route.
 */
export function getOgImage(routeName: string) {
    const res: Exclude<Metadata['openGraph'], null | undefined>['images'] = {
        url: new URL(`/api/og?title=${routeName}`, heroContent.url).toString(),
    };

    return res;
}

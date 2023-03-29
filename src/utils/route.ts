import projectsContent from '@content/projects.content';
import aboutContent from '@content/about.content';

export const PATHS = {
    '/projects': projectsContent.heading,
    '/about': aboutContent.heading,
} as const;

export type Sections = typeof PATHS;

export function getActiveLink(activePath: string | null) {
    if (activePath === '/') return '/projects';
    if (activePath === null || !Object.hasOwn(PATHS, activePath)) return null;
    return activePath as keyof Sections;
}

export function isLinkActive(linkHref: string, activePath: string | null) {
    return linkHref === getActiveLink(activePath);
}

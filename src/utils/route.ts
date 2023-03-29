import projectsContent from '@content/projects.content';
import aboutContent from '@content/about.content';

export const PATHS = {
    '/projects': projectsContent.heading,
    '/about': aboutContent.heading,
} as const;

export type Sections = typeof PATHS;

/**
 * Get the active path given the current path, accounting for the default route acting as a
 * different route.
 *
 * @param currentPath The current path, can be obtained with usePathName() from next/navigation
 * @returns The currently active path, or null if the current path is invalid or null
 */
export function getActivePath(currentPath: string | null) {
    if (currentPath === '/') return '/projects';
    if (currentPath === null || !Object.hasOwn(PATHS, currentPath)) return null;
    return currentPath as keyof Sections;
}

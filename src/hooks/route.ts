import { usePathname } from 'next/navigation';
import { getActivePath } from 'utils/route';

/**
 * Custom React hook to get the current active path, accounting for default route acting as a
 * different route.
 *
 * @returns The currently active path, or null if the current path is null
 */
export function useActivePath() {
    const path = usePathname();
    return [getActivePath(path), path] as const;
}

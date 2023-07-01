import type { Metadata } from 'next';
import { PATHS, getOgImage } from 'utils/route';

export { default } from 'app/projects/page';

export const metadata: Metadata = {
    openGraph: {
        images: [getOgImage(PATHS['/'].title)],
    },
};

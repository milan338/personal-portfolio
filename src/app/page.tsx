import { PATHS, getOgImage } from 'utils/route';
import type { Metadata } from 'next';

export { default } from 'app/projects/page';

export const metadata: Metadata = {
    openGraph: {
        images: [getOgImage(PATHS['/'].title)],
    },
};

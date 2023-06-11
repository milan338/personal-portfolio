import content from '@content/about.content';
import type { Metadata } from 'next';
import { PATHS, getOgImage } from 'utils/route';

export default function About() {
    const { paragraphs } = content;

    const mainContent = paragraphs.map((p) => (
        <p key={p} className="text-lg font-normal leading-8">
            {p}
        </p>
    ));

    return (
        <article id="about-tabpanel" className="pt-7" role="tabpanel" aria-label="about">
            <div
                className="glass-bg flex w-full flex-col items-start gap-4 rounded-xl border-4
                border-solid border-neutral-200/30 bg-white/20 p-6 shadow-lg"
            >
                {mainContent}
            </div>
        </article>
    );
}

export const metadata: Metadata = {
    title: content.title,
    openGraph: {
        images: [getOgImage(PATHS['/about'].title)],
    },
};

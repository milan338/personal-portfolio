'use client';

import projectsContent from '@content/projects.content.json';
import aboutContent from '@content/about.content.json';
import HeroSection from './HeroSection';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import type { ReactNode } from 'react';

type MainContentProps = {
    children?: ReactNode;
};

const SECTIONS = {
    '/projects': projectsContent.heading,
    '/about': aboutContent.heading,
} as const;

export default function MainContent(props: MainContentProps) {
    const { children } = props;
    const path = usePathname();
    const sections = Object.entries(SECTIONS);

    const links = sections.map(([href, heading], i) => {
        const active = href === path || (path === '/' && href === '/projects');
        const name = href.slice(1);

        return (
            <Fragment key={href}>
                <Link
                    id={`${name}-tab`}
                    className={`text-4xl font-medium motion-safe:transition-opacity ${
                        active ? 'opacity-100' : 'opacity-[0.45] hover:opacity-60'
                    }`}
                    href={href}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`${name}-tabpanel`}
                >
                    {heading}
                </Link>
                {i < sections.length - 1 && (
                    <div
                        key={`${href}-separator`}
                        className="hidden h-full w-1 bg-black opacity-10 sm:flex"
                    />
                )}
            </Fragment>
        );
    });

    return (
        <section
            id="main-content"
            className="relative z-10 flex h-auto w-[min(80vw,_48rem)] flex-col items-center"
        >
            <HeroSection />
            <div
                className="flex w-full flex-col justify-start gap-4 pt-12 sm:flex-row sm:gap-8"
                role="tablist"
            >
                {links}
            </div>
            {children}
        </section>
    );
}

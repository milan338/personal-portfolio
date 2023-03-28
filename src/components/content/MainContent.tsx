'use client';

import projectsContent from '@content/projects.content.json';
import aboutContent from '@content/about.content.json';
import HeroSection from './HeroSection';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import SectionsHamburger from 'app/SectionsHamburger';

type MainContentProps = {
    children?: ReactNode;
};

// TODO strongly type the map keys using the json
const PATHS = {
    '/projects': projectsContent.heading,
    '/about': aboutContent.heading,
} as const;
export type Sections = typeof PATHS;

// TODO refactor out
export function getActiveLink(activePath: string | null) {
    if (activePath === null || !Object.hasOwn(PATHS, activePath)) return null;
    return (activePath === '/' ? '/projects' : activePath) as keyof Sections;
}

// TODO refactor out
export function isLinkActive(linkHref: string, activePath: string | null) {
    return linkHref === getActiveLink(activePath);
}

export default function MainContent(props: MainContentProps) {
    const { children } = props;
    const path = usePathname();
    const activeLink = getActiveLink(path);
    const sections = Object.entries(PATHS);

    const links = sections.map(([href, heading], i) => {
        const active = isLinkActive(href, path);
        const name = href.slice(1);

        return (
            <Fragment key={href}>
                <li role="presentation">
                    <Link
                        className={`text-4xl font-medium motion-safe:transition-opacity ${
                            active ? 'opacity-active' : 'opacity-inactive hover:opacity-hover'
                        }`}
                        href={href}
                        role="tab"
                        aria-selected={active}
                        aria-controls={`${name}-tabpanel`}
                    >
                        {heading}
                    </Link>
                </li>
                {i < sections.length - 1 && (
                    <div className="hidden h-full w-[0.15rem] bg-black opacity-10 sm:flex" />
                )}
            </Fragment>
        );
    });

    return (
        <section
            id="main-content"
            className="relative z-10 flex h-auto w-responsive flex-col items-center"
        >
            <HeroSection />
            <ul
                className="flex w-full flex-col items-center justify-start gap-4 pt-12 max-lg:hidden sm:flex-row sm:gap-6"
                role="tablist"
            >
                {links}
            </ul>
            <div
                className="flex w-full flex-row items-center justify-start gap-4 pt-12 text-4xl font-medium
                sm:gap-6 lg:hidden"
            >
                <SectionsHamburger sections={PATHS} />
                {/* eslint-disable-next-line security/detect-object-injection */}
                {activeLink === null ? <></> : PATHS[activeLink]}
            </div>
            {children}
        </section>
    );
}

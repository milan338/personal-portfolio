'use client';

import projectsContent from '@content/projects.content.json';
import aboutContent from '@content/about.content.json';
import HeroSection from './HeroSection';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
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

    const links = Object.entries(SECTIONS).map(([href, heading]) => {
        const active = href === path || (path === '/' && href === '/projects');

        return (
            <Link
                key={href}
                className={`text-4xl font-medium motion-safe:transition-opacity ${
                    active ? 'opacity-100' : 'opacity-[0.45]'
                }`}
                href={href}
                aria-checked={active}
                aria-expanded={active}
            >
                {heading}
            </Link>
        );
    });

    return (
        <section
            id="main-content"
            className="relative z-10 flex h-auto w-[min(80vw,_48rem)] flex-col items-center"
        >
            <HeroSection />
            <div className="flex w-full flex-col justify-start gap-9 pt-14 sm:flex-row">
                {links}
            </div>
            {children}
        </section>
    );
}

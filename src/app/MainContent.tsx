'use client';

import HeroSection from './HeroSection';
import Link from 'next/link';
import { Fragment } from 'react';
import type { ReactNode } from 'react';
import NavigationHamburger from 'app/NavigationHamburger';
import { PATHS } from 'utils/route';
import { usePathname } from 'next/navigation';

type MainContentProps = {
    children?: ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
    const path = usePathname();
    if (!Object.hasOwn(PATHS, path)) throw new Error(`Path ${path} not in PATHS object`);
    const paths = Object.entries(PATHS).slice(1);

    const links = paths.map(([href, heading], i) => {
        const active = PATHS[href as keyof typeof PATHS] === PATHS[path as keyof typeof PATHS];
        const name = href.slice(1);

        return (
            <Fragment key={href}>
                <li role="presentation">
                    <Link
                        className={`motion-safe:transition-opacity ${
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
                {i < paths.length - 1 && (
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
                className="flex w-full flex-row items-center justify-start gap-6 pt-12 text-4xl font-medium max-lg:hidden"
                role="tablist"
            >
                {links}
            </ul>
            <div
                className="flex w-full flex-row items-center justify-start gap-4 pt-12 text-3xl font-medium sm:gap-6
                md:text-4xl lg:hidden"
            >
                <NavigationHamburger />
                {/* eslint-disable-next-line security/detect-object-injection */}
                {PATHS[path as keyof typeof PATHS]}
            </div>
            {children}
        </section>
    );
}

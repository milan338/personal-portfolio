'use client';

import HeroSection from './HeroSection';
import type { ReactNode } from 'react';
import NavigationHamburger from 'app/NavigationHamburger';
import { PATHS } from 'utils/route';
import { usePathname } from 'next/navigation';
import PathLinks from 'components/PathLinks';

type MainContentProps = {
    children?: ReactNode;
};

export default function MainContent({ children }: MainContentProps) {
    const path = usePathname();

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
                <PathLinks showSeparator />
            </ul>
            <div
                className="flex w-full flex-row items-center justify-start gap-4 pt-12 text-3xl font-medium sm:gap-6
                md:text-4xl lg:hidden"
            >
                <NavigationHamburger />
                {/* eslint-disable-next-line security/detect-object-injection */}
                {PATHS[path as keyof typeof PATHS].heading}
            </div>
            {children}
        </section>
    );
}

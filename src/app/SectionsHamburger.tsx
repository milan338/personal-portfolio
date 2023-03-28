'use client';

import { usePathname } from 'next/navigation';
import { isLinkActive } from './MainContent';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Modal from 'components/Modal';
import { CgMenuLeftAlt } from 'react-icons/cg';
import type { Sections } from './MainContent';

type SectionsHamburgerProps = {
    sections: Sections;
};

export default function SectionsHamburger(props: SectionsHamburgerProps) {
    const { sections } = props;
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const [expanded, setExpanded] = useState(false);
    const path = usePathname();

    const links = Object.entries(sections).map(([href, heading]) => {
        const active = isLinkActive(href, path);
        const name = href.slice(1);

        return (
            <li key={href} role="presentation">
                <Link
                    className={`motion-safe:transition-opacity ${
                        active ? 'opacity-active' : 'opacity-inactive hover:opacity-hover'
                    }`}
                    href={href}
                    role="tab"
                    aria-selected={active}
                    aria-controls={`${name}-tabpanel`}
                    onClick={() => setExpanded(false)}
                >
                    {heading}
                </Link>
            </li>
        );
    });

    return (
        <>
            <button
                ref={hamburgerRef}
                id="links-dropdown-button"
                className="glass-bg relative flex aspect-square items-center justify-center rounded-lg border-4
                border-solid border-neutral-200 border-opacity-30 bg-white bg-opacity-20 p-2 shadow-lg
                hover:-translate-y-1 motion-safe:transition-transform md:p-3"
                onClick={() => setExpanded(!expanded)}
                aria-label="open navigation modal"
                aria-controls="navigation-modal"
            >
                <CgMenuLeftAlt className="h-9 w-9 fill-black md:h-10 md:w-10" />
            </button>
            <Modal
                id="navigation-modal"
                className="px-5 py-6"
                visible={expanded}
                setVisible={setExpanded}
                aria-label="navigation menu"
            >
                <ul className="flex flex-col gap-4 text-2xl md:font-bold" role="tablist">
                    {links}
                </ul>
            </Modal>
        </>
    );
}

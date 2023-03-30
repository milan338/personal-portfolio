'use client';

import { PATHS } from 'utils/route';
import { useState, useRef } from 'react';
import Link from 'next/link';
import Modal from 'components/Modal';
import { CgMenuLeftAlt } from 'react-icons/cg';
import { usePathname } from 'next/navigation';

export default function NavigationHamburger() {
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const [expanded, setExpanded] = useState(false);
    const path = usePathname();
    if (!Object.hasOwn(PATHS, path)) throw new Error(`Path ${path} not in PATHS object`);

    const links = Object.entries(PATHS)
        .slice(1)
        .map(([href, heading]) => {
            const active = PATHS[href as keyof typeof PATHS] === PATHS[path as keyof typeof PATHS];
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

'use client';

import { useState, useRef } from 'react';
import Modal from 'components/Modal';
import { CgMenuLeftAlt } from 'react-icons/cg';
import PathLinks from 'components/PathLinks';

export default function NavigationHamburger() {
    const hamburgerRef = useRef<HTMLButtonElement>(null);
    const [expanded, setExpanded] = useState(false);

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
                    <PathLinks onClick={() => setExpanded(false)} />
                </ul>
            </Modal>
        </>
    );
}

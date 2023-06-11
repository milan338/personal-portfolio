'use client';

import { useRef } from 'react';
import Modal from 'components/Modal';
import { CgMenuLeftAlt } from 'react-icons/cg';
import PathLinks from 'components/PathLinks';
import type { ModalRef } from 'components/Modal';

export default function NavigationHamburger() {
    const modalRef = useRef<ModalRef>(null);

    return (
        <>
            <button
                id="links-dropdown-button"
                className="glass-bg relative flex aspect-square items-center justify-center
                rounded-lg border-4 border-solid border-neutral-200/30 bg-white/20 p-2
                shadow-lg hover:-translate-y-1 motion-safe:transition-transform md:p-3"
                onClick={() => modalRef.current?.show()}
                aria-label="open navigation modal"
                aria-controls="navigation-modal"
            >
                <CgMenuLeftAlt className="h-9 w-9 fill-black md:h-10 md:w-10" />
            </button>
            <Modal
                ref={modalRef}
                id="navigation-modal"
                className="px-5 py-6"
                aria-label="navigation menu"
            >
                <ul className="flex flex-col gap-4 text-2xl md:font-bold" role="tablist">
                    <PathLinks onClick={() => modalRef.current?.close()} />
                </ul>
            </Modal>
        </>
    );
}

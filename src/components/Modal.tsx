'use client';

import { createPortal } from 'react-dom';
import { useRef } from 'react';
import { useMouseDown } from 'hooks/dom';
import { CgClose } from 'react-icons/cg';
import type { ReactNode, SetStateAction, Dispatch } from 'react';

type ModalProps = {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    children: ReactNode;
};

export default function Modal(props: ModalProps) {
    const { visible, setVisible, children } = props;
    const modalRef = useRef<HTMLDivElement>(null);

    useMouseDown((event) => {
        if (!modalRef.current) return;
        // Close modal when pressing outside
        if (!modalRef.current.contains(event.target as Node)) setVisible(false);
    });

    if (!visible || typeof document === 'undefined') return null;
    const element = document.querySelector('main');
    if (element === null) throw new Error('Main element not defined');

    const modal = (
        <div className="fixed z-50 flex h-full w-full items-center justify-center">
            <div
                ref={modalRef}
                className="glass-bg relative z-50 mt-[5vh] flex h-fit w-responsive transform-gpu flex-col
                rounded-xl border-4 border-solid border-neutral-200 border-opacity-80 bg-white bg-opacity-90
                p-4 text-xl shadow-lg"
            >
                <button
                    className="absolute top-4 right-4 h-6 w-6"
                    onClick={() => setVisible(false)}
                >
                    <CgClose className="h-full w-full" />
                </button>
                {children}
            </div>
            <div className="fixed -z-10 h-full w-full bg-black opacity-30" />
        </div>
    );

    return createPortal(modal, element);
}

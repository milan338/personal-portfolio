'use client';

import dynamic from 'next/dynamic';
import { createPortal } from 'react-dom';
import { useRef } from 'react';
import { useMouseDown, useKeyDown } from 'hooks/dom';
import { CgClose } from 'react-icons/cg';
import { usePreventScroll } from 'hooks/window';
import type { SetStateAction, Dispatch } from 'react';

type ModalProps = JSX.IntrinsicElements['div'] & {
    visible: boolean;
    setVisible: Dispatch<SetStateAction<boolean>>;
    'aria-label': string;
};

const DynamicFocusTrap = dynamic(async () => import('focus-trap-react'));

export default function Modal({ className, visible, setVisible, children, ...props }: ModalProps) {
    const modalRef = useRef<HTMLDivElement>(null);

    // Close modal when pressing outside
    useMouseDown((event) => {
        if (!modalRef.current) return;
        if (!modalRef.current.contains(event.target as Node)) setVisible(false);
    });

    // Close modal when pressing escape
    useKeyDown((event) => {
        if (event.key !== 'Escape') return;
        setVisible(false);
    });

    // Prevent scrolling outside the modal while visible
    usePreventScroll(visible);

    const modalContent = (
        <div
            ref={modalRef}
            className={`glass-bg relative z-50 flex h-fit w-responsive transform-gpu flex-row items-center justify-between
            rounded-xl border-4 border-solid border-neutral-200 border-opacity-80 bg-white bg-opacity-90 shadow-lg
            group-aria-hidden:scale-105 group-aria-hidden:opacity-0 motion-safe:transition-[transform,opacity] ${
                className ?? ''
            }`}
        >
            <div className="flex flex-col">{children}</div>
            <button className="h-6 w-6 self-start" onClick={() => setVisible(false)}>
                <CgClose className="h-full w-full" />
            </button>
        </div>
    );

    const modal = visible ? (
        <DynamicFocusTrap>
            <div
                className="group fixed z-50 flex h-full w-full items-center justify-center
                transition-[visibility] aria-hidden:pointer-events-none aria-hidden:invisible"
                role="alertdialog"
                aria-modal="true"
                aria-hidden={!visible}
                {...props}
            >
                {modalContent}
                <div
                    className="fixed -z-10 h-full w-full bg-black opacity-30 group-aria-hidden:opacity-0
                    motion-safe:transition-opacity"
                />
            </div>
        </DynamicFocusTrap>
    ) : (
        <></>
    );

    if (!visible || typeof document === 'undefined') return modal;
    const mainElement = document.querySelector('main');
    if (mainElement === null) throw new Error('Main element not defined');

    return createPortal(modal, mainElement);
}

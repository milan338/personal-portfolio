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

    const modal = (
        <div
            className="group fixed z-50 flex h-full w-full items-center justify-center
            transition-[visibility] data-invisible:pointer-events-none data-invisible:invisible"
            data-visible={visible}
        >
            <div
                ref={modalRef}
                className="glass-bg relative z-50 flex h-fit w-responsive transform-gpu flex-row
                items-center justify-between rounded-xl border-4 border-solid border-neutral-200
                border-opacity-80 bg-white bg-opacity-90 p-4 text-xl shadow-lg group-data-invisible:scale-105
                group-data-invisible:opacity-0 motion-safe:transition-[transform,opacity]"
            >
                <div className="flex flex-col">{children}</div>
                <button className="h-6 w-6 self-start" onClick={() => setVisible(false)}>
                    <CgClose className="h-full w-full" />
                </button>
            </div>
            <div
                className="fixed -z-10 h-full w-full bg-black opacity-0 group-data-visible:opacity-30
                motion-safe:transition-opacity"
            />
        </div>
    );

    if (typeof document === 'undefined') return modal;
    const element = document.querySelector('main');
    if (element === null) throw new Error('Main element not defined');

    return createPortal(modal, element);
}

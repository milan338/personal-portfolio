'use client';

import { usePreventScroll } from 'hooks/window';
import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { CgClose } from 'react-icons/cg';
import { mergeRefs } from 'react-merge-refs';

export type ModalRef = {
    show: () => void;
    close: () => void;
};

type ModalProps = JSX.IntrinsicElements['dialog'] & {
    'aria-label': string;
};

export const Modal = forwardRef<ModalRef, ModalProps>(({ className, children, ...props }, ref) => {
    const dialogRef = useRef<HTMLDialogElement>(null);
    const [preventScrollRef, enableScroll, disableScroll] = usePreventScroll();

    const show = useCallback(() => {
        dialogRef.current?.showModal();
        dialogRef.current?.removeAttribute('aria-hidden');
        disableScroll();
    }, [disableScroll]);

    const close = () => dialogRef.current?.close();

    useImperativeHandle(ref, () => ({ show, close }), [show]);

    return (
        <dialog
            ref={mergeRefs([dialogRef, preventScrollRef])}
            className="fixed inset-0 z-50 flex h-screen max-h-screen w-screen max-w-[100vw] transform-gpu flex-row
            items-center justify-center bg-transparent p-0 aria-hidden:pointer-events-none aria-hidden:scale-105
            aria-hidden:opacity-0 aria-hidden:backdrop:opacity-0 motion-safe:transition-[opacity,transform]
            backdrop:motion-safe:transition-opacity"
            role="dialog"
            aria-modal="true"
            aria-hidden="true"
            onClose={() => {
                dialogRef.current?.setAttribute('aria-hidden', 'true');
                enableScroll();
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) close();
            }}
            {...props}
        >
            <div
                className={`glass-bg flex h-fit w-responsive transform-gpu flex-col rounded-xl border-4 border-solid
                border-neutral-200/95 bg-white/90 shadow-lg ${className ?? ''}`}
            >
                {children}
                <button
                    className="absolute right-4 top-4 h-6 w-6"
                    onClick={close}
                    aria-label="close modal"
                >
                    <CgClose className="h-full w-full" />
                </button>
            </div>
        </dialog>
    );
});
Modal.displayName = 'Modal';

export default Modal;

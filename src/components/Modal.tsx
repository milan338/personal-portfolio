'use client';

import { forwardRef, useCallback, useImperativeHandle, useRef } from 'react';
import { CgClose } from 'react-icons/cg';
import { usePreventScroll } from 'hooks/window';
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
        dialogRef.current?.setAttribute('aria-hidden', 'false');
        disableScroll();
    }, [disableScroll]);

    const close = () => dialogRef.current?.close();

    useImperativeHandle(ref, () => ({ show, close }), [show]);

    return (
        <dialog
            ref={mergeRefs([dialogRef, preventScrollRef])}
            className="glass-bg box motion-safe:transition-[opacity,transform] fixed inset-0 z-50 m-auto flex h-fit w-responsive transform-gpu
            flex-row items-center justify-between rounded-xl border-4 border-solid border-neutral-200/95
            bg-white/90 p-0 shadow-lg aria-hidden:pointer-events-none aria-hidden:scale-105
            aria-hidden:opacity-0 aria-hidden:backdrop:opacity-0 backdrop:motion-safe:transition-opacity"
            role="alertdialog"
            aria-modal="true"
            aria-hidden="true"
            onClose={() => {
                enableScroll();
                dialogRef.current?.setAttribute('aria-hidden', 'true');
            }}
            onClick={(event) => {
                if (event.target === event.currentTarget) close();
            }}
            {...props}
        >
            <div className={`flex w-full flex-col ${className ?? ''}`}>{children}</div>
            <button
                className="absolute right-4 top-4 h-6 w-6"
                onClick={close}
                aria-label="close modal"
            >
                <CgClose className="h-full w-full" />
            </button>
        </dialog>
    );
});
Modal.displayName = 'Modal';

export default Modal;

import type { MouseEventHandler, ReactNode } from 'react';

type ButtonProps = {
    onClick?: MouseEventHandler;
    href?: string;
    children?: ReactNode;
};

export default function Button(props: ButtonProps) {
    const { onClick, href, children } = props;
    return (
        <a
            className="glass-bg transform-gpu rounded-xl border-4 border-solid border-white border-opacity-30
            bg-blue-300 bg-opacity-20 px-10 py-5 text-xl font-normal shadow-sm hover:-translate-y-1
            motion-safe:transition-transform"
            onClick={onClick}
            href={href}
            target="_blank"
            rel="noreferrer"
        >
            {children}
        </a>
    );
}

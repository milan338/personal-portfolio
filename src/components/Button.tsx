import type { ReactNode } from 'react';

type ButtonProps = JSX.IntrinsicElements['a'] & {
    target?: string;
    children?: ReactNode;
    className?: string;
};

export default function Button({ target, href, children, className, ...props }: ButtonProps) {
    return (
        <a
            className={`glass-bg transform-gpu rounded-xl border-4 border-solid border-white/30
            bg-blue-300/20 text-xl font-normal shadow-md hover:-translate-y-1
            motion-safe:transition-transform ${className ?? ''}`}
            target={target}
            href={href}
            rel="noreferrer noopener"
            {...props}
        >
            {children}
        </a>
    );
}

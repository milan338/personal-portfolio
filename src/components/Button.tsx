import type { ReactNode } from 'react';

type ButtonProps = JSX.IntrinsicElements['a'] & {
    target?: string;
    children?: ReactNode;
};

export default function Button({ target, href, children, ...props }: ButtonProps) {
    return (
        <a
            className="glass-bg transform-gpu rounded-xl border-4 border-solid border-white border-opacity-30
            bg-blue-300 bg-opacity-20 px-10 py-5 text-xl font-normal shadow-md hover:-translate-y-1
            motion-safe:transition-transform"
            target={target}
            href={href}
            rel="noreferrer noopener"
            {...props}
        >
            {children}
        </a>
    );
}

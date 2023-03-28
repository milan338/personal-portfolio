import type { LinkProps } from 'next/link';
import Link from 'next/link';
import type { ReactNode } from 'react';

type ButtonProps = LinkProps & {
    target?: string;
    children?: ReactNode;
};

export default function Button({ target, href, children, ...props }: ButtonProps) {
    return (
        <Link
            className="glass-bg transform-gpu rounded-xl border-4 border-solid border-white border-opacity-30
            bg-blue-300 bg-opacity-20 px-10 py-5 text-xl font-normal shadow-sm hover:-translate-y-1
            motion-safe:transition-transform"
            target={target}
            href={href}
            rel="noreferrer noopener"
            prefetch={false}
            {...props}
        >
            {children}
        </Link>
    );
}

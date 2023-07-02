import type { ReactNode } from 'react';

type ProjectCardProps = {
    label: string;
    description: string;
    url: string;
    children?: ReactNode;
};

export default function ProjectCard({ label, description, url, children }: ProjectCardProps) {
    return (
        <a
            className="glass-bg z-20 flex transform-gpu cursor-pointer flex-col rounded-xl
            border-4 border-solid border-neutral-200/30 bg-white/20 p-4 shadow-lg
            hover:-translate-y-1 motion-safe:transition-transform"
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={label}
        >
            <h1 className="text-xl font-medium sm:text-2xl">{label}</h1>
            <p className="grow pt-2 text-base font-normal leading-7 sm:text-lg">{description}</p>
            <div className="flex flex-row items-center gap-1 pt-4">{children}</div>
        </a>
    );
}

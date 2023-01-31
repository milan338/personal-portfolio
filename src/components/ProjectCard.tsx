import type { ReactNode } from 'react';

type ProjectCardProps = {
    label: string;
    description: string;
    url: string;
    children?: ReactNode;
};

export default function ProjectCard(props: ProjectCardProps) {
    const { label, description, url, children } = props;
    return (
        <a
            className="glass-bg z-20 flex transform-gpu cursor-pointer flex-col rounded-xl border-2
            border-solid border-neutral-200 border-opacity-30 bg-white bg-opacity-20 p-4 shadow-lg
            transition-transform hover:-translate-y-1"
            href={url}
            target="_blank"
            rel="noreferrer"
        >
            <h1 className="text-2xl font-medium">{label}</h1>
            <p className="flex-grow pt-2 text-lg font-normal leading-7">{description}</p>
            <div className="flex flex-row items-center gap-1 pt-4">{children}</div>
        </a>
    );
}

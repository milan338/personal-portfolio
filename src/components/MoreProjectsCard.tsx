import heroContent from '@content/hero.content';
import projectsContent from '@content/projects.content';
import { BsArrowUpRight, BsArrowRight } from 'react-icons/bs';

export default function MoreProjectsCard() {
    const url = heroContent.links.find((linkItem) => linkItem.label === 'Github')?.url;
    if (url === undefined) throw new Error('Github link not defined');

    return (
        <a
            className="glass-bg group z-20 flex cursor-pointer flex-row gap-4 rounded-xl border-4
            border-solid border-neutral-200/30 bg-white/20 p-4 shadow-lg md:flex-col"
            href={url}
            target="_blank"
            rel="noreferrer noopener"
            aria-label={projectsContent.moreProjects.label}
        >
            <h1 className="text-xl font-medium leading-8 sm:text-2xl">
                {projectsContent.moreProjects.label}
            </h1>
            <div className="hidden h-full w-full items-center justify-center md:flex">
                <div className="flex aspect-square max-h-36 w-[70%] max-w-[9rem] items-center justify-center rounded-full bg-neutral-100">
                    <BsArrowUpRight className="h-10 w-10 transform-gpu group-hover:-translate-y-1 group-hover:translate-x-1 motion-safe:transition-transform" />
                </div>
            </div>
            <div className="flex aspect-auto items-center pl-1 md:hidden">
                <BsArrowRight className="h-8 w-8 transform-gpu group-hover:translate-x-1 motion-safe:transition-transform" />
            </div>
        </a>
    );
}

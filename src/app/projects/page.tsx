import content from '@content/projects.content';
import MoreProjectsCard from 'components/MoreProjectsCard';
import ProjectCard from 'components/ProjectCard';
import type { Metadata } from 'next';
import { PATHS, getOgImage } from 'utils/route';

export default function Projects() {
    const { projects } = content;

    const projectCards = projects.map(({ label, description, url, icons }) => {
        return (
            <ProjectCard key={label} label={label} description={description} url={url}>
                {Object.entries(icons).map(([name, Icon]) => (
                    <Icon
                        key={name}
                        className="h-6 w-6 text-slate-800"
                        aria-label={`${name} icon`}
                    />
                ))}
            </ProjectCard>
        );
    });

    return (
        <section
            id="projects-tabpanel"
            className="w-full items-start"
            role="tabpanel"
            aria-label="projects"
        >
            <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-2 lg:grid-cols-3">
                {projectCards}
                <MoreProjectsCard />
            </div>
        </section>
    );
}

export const metadata: Metadata = {
    title: content.title,
    openGraph: {
        images: [getOgImage(PATHS['/projects'].title)],
    },
};

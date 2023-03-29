import content from '@content/projects.content';
import MoreProjectsCard from 'components/MoreProjectsCard';
import ProjectCard from 'components/ProjectCard';
import {
    SiC,
    SiCsharp,
    SiNextdotjs,
    SiReact,
    SiThreedotjs,
    SiTypescript,
    SiUnity,
    SiCplusplus,
    SiArduino,
    SiPython,
    SiQt,
} from 'react-icons/si';
import type { IconType } from 'react-icons';

const ICONS: Record<(typeof content)['projects'][number]['icons'][number], IconType> = {
    c: SiC,
    'c#': SiCsharp,
    'next.js': SiNextdotjs,
    react: SiReact,
    'three.js': SiThreedotjs,
    typescript: SiTypescript,
    unity: SiUnity,
    'c++': SiCplusplus,
    arduino: SiArduino,
    python: SiPython,
    qt: SiQt,
};

export default function Projects() {
    const { projects } = content;

    const projectCards = projects.map(({ label, description, url, icons }) => {
        return (
            <ProjectCard key={label} label={label} description={description} url={url}>
                {icons.map((iconName) => {
                    // eslint-disable-next-line security/detect-object-injection
                    const Icon = ICONS[iconName];
                    return (
                        <Icon key={`${label}-${iconName}`} className="h-6 w-6 text-slate-800 " />
                    );
                })}
            </ProjectCard>
        );
    });

    return (
        <section
            id="projects-tabpanel"
            className="items-left w-full"
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

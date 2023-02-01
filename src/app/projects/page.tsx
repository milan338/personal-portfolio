import content from '@content/projects.content.json';
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

const ICONS = new Map([
    ['c', SiC],
    ['c#', SiCsharp],
    ['next.js', SiNextdotjs],
    ['react', SiReact],
    ['three.js', SiThreedotjs],
    ['typescript', SiTypescript],
    ['unity', SiUnity],
    ['c++', SiCplusplus],
    ['arduino', SiArduino],
    ['python', SiPython],
    ['qt', SiQt],
]);

export default function Projects() {
    const { projects } = content;

    const projectCards = projects.map(({ label, description, url, icons }) => {
        return (
            <ProjectCard key={label} label={label} description={description} url={url}>
                {icons.map((iconName) => {
                    const Icon = ICONS.get(iconName);
                    if (Icon === undefined)
                        throw new Error(`Icon ${iconName} is not a valid project icon`);
                    return (
                        <Icon key={`${label}-${iconName}`} className="h-6 w-6 text-slate-800 " />
                    );
                })}
            </ProjectCard>
        );
    });

    return (
        <div className="items-left w-full">
            <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-2 lg:grid-cols-3">
                {projectCards}
                <MoreProjectsCard />
            </div>
        </div>
    );
}

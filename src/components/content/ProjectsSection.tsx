import content from '@content/projects.content.json';
import ProjectCard from 'components/ProjectCard';
import Section from 'components/Section';
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

export default function ProjectsSection() {
    return (
        <Section heading="My Projects">
            <div className="grid grid-cols-1 gap-5 pt-7 md:grid-cols-2 lg:grid-cols-3">
                {content.map(({ label, description, url, icons }) => {
                    return (
                        <ProjectCard key={label} label={label} description={description} url={url}>
                            {icons.map((iconName) => {
                                const Icon = ICONS.get(iconName);
                                if (Icon === undefined)
                                    throw new Error(`Icon ${iconName} is not a valid project icon`);
                                return <Icon key={`${label}-${iconName}`} className="h-6 w-6" />;
                            })}
                        </ProjectCard>
                    );
                })}
                {/* TODO view all projects card */}
            </div>
        </Section>
    );
}

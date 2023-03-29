import content from '@content/hero.content';
import Button from 'components/Button';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import type { IconType } from 'react-icons';

const ICONS: Record<(typeof content)['links'][number]['icon'], IconType> = {
    github: SiGithub,
    linkedin: SiLinkedin,
};

export default function HeroSection() {
    const { heading, subheading, links, contactButtonLabel, mail } = content;

    const linkButtons = links.map(({ label, url, icon }) => {
        // eslint-disable-next-line security/detect-object-injection
        const Icon = ICONS[icon];
        return (
            <a key={label} href={url} target="_blank" rel="noreferrer noopener" aria-label={label}>
                <Icon
                    className="h-9 w-9 text-slate-800 opacity-70 hover:opacity-100
                    motion-safe:transition-opacity"
                />
            </a>
        );
    });

    return (
        <section className="items-left w-full pt-14">
            <h1 className="mx-[-6px] text-7xl font-medium md:text-8xl">{heading}</h1>
            <h2 className="text-lg font-normal sm:w-2/3 md:text-2xl">{subheading}</h2>
            <div className="items-left flex flex-col gap-6 pt-5 text-center sm:flex-row sm:items-center">
                <Button href={`mailto:${mail}`} target="_blank">
                    {contactButtonLabel}
                </Button>
                <div className="flex flex-row items-center gap-6 pl-1 sm:pl-0">{linkButtons}</div>
            </div>
        </section>
    );
}

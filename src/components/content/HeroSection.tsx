import content from '@content/hero.content.json';
import Button from 'components/Button';
import { Fragment } from 'react';
import { SiGithub, SiLinkedin } from 'react-icons/si';
import type { ReactNode } from 'react';

const ICONS = new Map([
    ['github', SiGithub],
    ['linkedin', SiLinkedin],
]);

export default function HeroSection() {
    const { heading, subheadings, links, contactButtonLabel, mail } = content;

    const subheading: ReactNode[] = [];
    for (const s of subheadings)
        subheading.push(<Fragment key={s}>{s}</Fragment>, <br key={`${s}-br`} />);
    subheading.pop();

    return (
        <section className="items-left w-full pt-14">
            <h1 className="mx-[-6px] text-8xl font-medium">{heading}</h1>
            <h2 className="text-2xl font-normal">{subheading}</h2>
            <div className="items-left flex flex-col gap-6 pt-7 text-center sm:flex-row sm:items-center">
                <Button href={`mailto:${mail}`}>{contactButtonLabel}</Button>
                <div className="flex flex-row items-center gap-6 pl-2 sm:pl-0">
                    {links.map(({ label, url, icon }) => {
                        const Icon = ICONS.get(icon);
                        if (Icon === undefined) throw new Error(`Link ${icon} is not a valid link`);
                        return (
                            <a
                                key={label}
                                href={url}
                                target="_blank"
                                rel="noreferrer"
                                aria-label={label}
                            >
                                <Icon className="h-9 w-9 text-slate-800 opacity-70 transition-opacity hover:opacity-100" />
                            </a>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}

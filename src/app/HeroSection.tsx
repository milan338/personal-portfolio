import content from '@content/hero.content';
import Button from 'components/Button';

export default function HeroSection() {
    const { heading, subheading, links, contactButtonLabel, mail } = content;

    const linkButtons = links.map(({ label, url, Icon }) => {
        return (
            <a key={label} href={url} target="_blank" rel="noreferrer noopener" aria-label={label}>
                <Icon
                    className="h-9 w-9 text-slate-800 opacity-70 hover:opacity-100
                    motion-safe:transition-opacity"
                    aria-label={`${label} icon`}
                />
            </a>
        );
    });

    return (
        <section className="w-full items-start pt-14">
            <h1 className="mx-[-6px] text-6xl font-medium sm:text-7xl md:text-8xl">{heading}</h1>
            <h2 className="text-base font-normal sm:w-2/3 sm:text-lg md:text-2xl">{subheading}</h2>
            <div className="flex flex-col items-start gap-6 pt-5 text-center sm:flex-row sm:items-center">
                <Button
                    className="px-9 py-4 sm:px-10 sm:py-5"
                    href={`mailto:${mail}`}
                    target="_blank"
                >
                    {contactButtonLabel}
                </Button>
                <div className="flex flex-row items-center gap-6 pl-1 sm:pl-0">{linkButtons}</div>
            </div>
        </section>
    );
}

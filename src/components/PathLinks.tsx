import { PATHS } from 'utils/route';
import { usePathname } from 'next/navigation';
import type { MouseEventHandler } from 'react';
import Link from 'next/link';
import { Fragment } from 'react';

type PathLinksProps = {
    showSeparator?: boolean;
    onClick?: MouseEventHandler<HTMLAnchorElement>;
};

export default function PathLinks({ showSeparator, onClick }: PathLinksProps) {
    const path = usePathname();
    const paths = Object.entries(PATHS).slice(1);
    if (!Object.hasOwn(PATHS, path)) throw new Error(`Path ${path} not in PATHS object`);

    const links = paths.map(([href, { heading }], i) => {
        const active =
            PATHS[href as keyof typeof PATHS].id === PATHS[path as keyof typeof PATHS].id;
        const name = href.slice(1);

        return (
            <Fragment key={href}>
                <li role="presentation">
                    <Link
                        className={`motion-safe:transition-opacity ${
                            active ? 'opacity-active' : 'opacity-inactive hover:opacity-hover'
                        }`}
                        href={href}
                        role="tab"
                        aria-selected={active}
                        aria-controls={`${name}-tabpanel`}
                        onClick={onClick}
                    >
                        {heading}
                    </Link>
                </li>
                {showSeparator === true && i < paths.length - 1 && (
                    <div className="hidden h-full w-[0.15rem] bg-black opacity-10 sm:flex" />
                )}
            </Fragment>
        );
    });

    return <>{links}</>;
}

import type { ReactNode } from 'react';

type SectionProps = {
    heading: string;
    children?: ReactNode;
};

export default function Section(props: SectionProps) {
    const { heading, children } = props;
    return (
        <section className="items-left w-full pt-14">
            <h1 className="text-4xl font-medium">{heading}</h1>
            {children}
        </section>
    );
}

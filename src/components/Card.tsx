import type { ReactNode } from 'react';

type CardProps = {
    children?: ReactNode;
};

export default function Card(props: CardProps) {
    const { children } = props;
    return <div className="glass-bg bg-opacity-30">{children}</div>;
}

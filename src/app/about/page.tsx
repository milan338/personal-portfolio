import content from '@content/about.content.json';

export default function About() {
    const { paragraphs } = content;

    return (
        <div className="flex w-full flex-col items-start gap-4 pt-5">
            {paragraphs.map((p) => (
                <p key={p} className="gap-10 text-lg font-normal leading-8">
                    {p}
                </p>
            ))}
        </div>
    );
}

import content from '@content/about.content.json';

export default function About() {
    const { paragraphs } = content;

    const mainContent = paragraphs.map((p) => (
        <p key={p} className="text-lg font-normal leading-8">
            {p}
        </p>
    ));

    return (
        <article className="pt-7">
            <div
                className="glass-bg flex w-full flex-col items-start gap-4 rounded-xl border-4 border-solid
              border-neutral-200 border-opacity-30 bg-white bg-opacity-20 p-6 shadow-lg"
            >
                {mainContent}
            </div>
        </article>
    );
}

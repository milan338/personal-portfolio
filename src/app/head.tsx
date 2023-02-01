import content from '@content/hero.content.json';

// TODO improve SEO

export default function Head() {
    return (
        <>
            <title>{content.heading}</title>

            <meta name="title" content={content.heading} />
            <meta name="description" content={content.subheadings.join(' ')} />
            <meta content="width=device-width, initial-scale=1" name="viewport" />

            <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png" />
            <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png" />
            <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png" />
            <link rel="icon" href="/favicon.ico" />

            <link rel="manifest" href="/site.webmanifest" />
        </>
    );
}

import { Poppins } from 'next/font/google';
import content from '@content/hero.content';
import MainContent from './MainContent';
import { ANALYTICS_INTEGRITY, ANALYTICS_SRC } from 'utils/window';
import DiamondsBackground from 'components/DiamondsBackground';
import 'styles/globals.scss';
import type { Metadata } from 'next';
import Script from 'next/script';

const POPPINS = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    style: ['normal'],
    weight: ['400', '500'],
    display: 'swap',
});

export default function RootLayout({ children }: RootLayoutProps) {
    return (
        <html lang="en" className={`${POPPINS.variable} bg-neutral-50`}>
            <body className="min-h-screen pb-20">
                <div id="window-size" className="invisible absolute -z-50 h-screen w-full" />
                <main className="flex min-h-0 w-full justify-center">
                    <DiamondsBackground />
                    <MainContent>{children}</MainContent>
                    <Script
                        src={ANALYTICS_SRC}
                        integrity={ANALYTICS_INTEGRITY}
                        strategy="lazyOnload"
                        crossOrigin="anonymous"
                        async
                        defer
                    />
                </main>
            </body>
        </html>
    );
}

export const metadata: Metadata = {
    title: {
        default: content.heading,
        template: `%s | ${content.heading}`,
    },
    description: content.subheading,
    icons: {
        icon: '/favicon.ico',
        apple: '/apple-touch-icon.png',
    },
    openGraph: {
        title: content.heading,
        description: content.subheading,
        url: content.url,
        siteName: content.heading,
        locale: 'en-US',
        type: 'website',
    },
    robots: {
        index: true,
        follow: true,
        googleBot: {
            index: true,
            follow: true,
            'max-video-preview': -1,
            'max-image-preview': 'large',
            'max-snippet': -1,
        },
    },
    twitter: {
        title: content.heading,
        card: 'summary_large_image',
    },
};

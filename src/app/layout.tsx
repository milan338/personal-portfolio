import { Poppins } from '@next/font/google';
import MainContent from 'components/content/MainContent';
import DiamondsBackground from 'components/DiamondsBackground';
import 'styles/globals.scss';

const POPPINS = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    style: ['normal'],
    weight: ['400', '500'],
    display: 'swap',
});

export default function RootLayout(props: RootLayoutProps) {
    const { children } = props;
    return (
        <html lang="en" className={`${POPPINS.variable}`}>
            <head />
            <body>
                <div id="window-size" className="invisible absolute -z-50 h-screen w-full" />
                <main className="flex min-h-0 justify-center bg-neutral-50">
                    <DiamondsBackground />
                    <MainContent>{children}</MainContent>
                </main>

                <footer className="h-20" />
            </body>
        </html>
    );
}

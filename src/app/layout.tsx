import { Poppins } from '@next/font/google';
import 'styles/globals.scss';

const POPPINS = Poppins({
    variable: '--font-poppins',
    subsets: ['latin'],
    style: ['normal'],
    weight: ['300', '400'],
    display: 'swap',
});

export default function RootLayout(props: RootLayoutProps) {
    const { children } = props;
    return (
        <html lang="en" className={`${POPPINS.variable}`}>
            <head />
            <body>
                <div id="window-size" className="-z-50 invisible w-full h-screen absolute" />
                {children}
            </body>
        </html>
    );
}

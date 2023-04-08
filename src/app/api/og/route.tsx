import content from '@content/hero.content';
import { ImageResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export async function GET({ nextUrl }: NextRequest) {
    const { searchParams } = nextUrl;
    const { heading, subheading } = content;

    const bgURL = new URL('../../../../public/images/og-bg.png', import.meta.url);
    const fontUrl = new URL('../../../../public/fonts/poppins-regular.ttf', import.meta.url);
    const fontData = await (await fetch(fontUrl)).arrayBuffer();

    const image = (
        <div
            tw="relative flex h-full w-full flex-col items-start justify-end p-32"
            style={{ backgroundImage: `url(${bgURL.toString()})` }}
        >
            <svg
                width={100}
                xmlns="http://www.w3.org/2000/svg"
                xmlSpace="preserve"
                viewBox="0 0 512 512"
                style={{
                    position: 'absolute',
                    bottom: '8rem',
                    right: '8rem',
                    borderRadius: '0.5rem',
                }}
            >
                <path d="M335 513H1V1.1h511.8V513H335m-60-131.7 4.2-.2V135.3c-12.5 0-24.8.1-37.1-.1-3.5 0-4.9 1.2-6.2 4.2l-48 107.3-33.7 75.1-2.4-5-16.9-37.6-62.6-139.6c-.8-1.7-2.6-4-4-4.1-13-.3-26.2-.2-39.5-.2V381H70V225.6l2.9 6c21.6 48.6 43.3 97.1 64.8 145.7 1.4 3 2.9 4.3 6.3 4.1 6.6-.3 13.3-.3 20 0 3.2.1 4.8-.8 6.2-4l56.9-128 9.9-21.9.8.2v153.6H275m144.6-208.7c11.5 6.3 18.9 15.5 19.7 29.2h44.5c-1.3-22.9-9.6-42.2-28.7-54.7-34-22.2-70-22.4-105.2-4.1-26.4 13.7-36.3 37.8-33.8 66.9 2.2 27 18 43.8 42.6 53.2 7.9 3 16 5.4 24 8 13.8 4.3 27.8 8 41.3 13.1 9 3.4 16 9.7 18.7 19.5a32.2 32.2 0 0 1-19.8 39.4 61.6 61.6 0 0 1-32.4 3 36.7 36.7 0 0 1-32.3-31.3c-.4-2.3-.6-4.6-.8-7h-43.1a65.5 65.5 0 0 0 22.3 53.7c18.4 16.3 40.7 22 64.6 22.2 22.8.1 43.7-6 61.4-21.1 32.2-27.6 35.4-91.4-18-112.3-12.2-4.8-25-8-37.3-12.3-11.5-4-23.2-7.3-34-12.5-11.7-5.5-16.6-15.9-15.3-29a28.8 28.8 0 0 1 20-25.5c13.8-5 27.5-4.3 41.6 1.6z" />
                <path
                    fill="#FCFCFC"
                    d="M274.6 381.3H238V227.7l-.8-.2-10 22c-19 42.6-38 85.2-56.8 128-1.4 3.1-3 4-6.2 3.9-6.7-.3-13.4-.3-20 0-3.4.2-4.9-1-6.3-4-21.5-48.7-43.2-97.2-64.8-145.7l-2.9-6.1V381H28.8V135.3c13.3 0 26.4-.1 39.5.2 1.4 0 3.2 2.4 4 4.1 21 46.5 41.8 93 62.6 139.6l17 37.7 2.3 5 33.7-75.2 48-107.3c1.3-3 2.7-4.3 6.2-4.2 12.3.2 24.6 0 37.1 0v245.9l-4.6.2z"
                />
                <path
                    fill="#FDFDFD"
                    d="M419.4 172.4a55.1 55.1 0 0 0-41.2-1.4 28.8 28.8 0 0 0-20 25.6c-1.4 13 3.5 23.4 15.1 28.9 10.9 5.2 22.6 8.6 34 12.5 12.5 4.2 25.2 7.5 37.4 12.3 53.4 21 50.2 84.7 18 112.3a90.2 90.2 0 0 1-61.4 21c-23.9 0-46.2-5.8-64.6-22a65.5 65.5 0 0 1-22.3-53.8h43c.3 2.4.5 4.7.9 7 3 17.2 15 28.7 32.3 31.3 11 1.6 22 1.2 32.4-3a32.2 32.2 0 0 0 19.8-39.4 28.8 28.8 0 0 0-18.7-19.5c-13.5-5-27.5-8.8-41.2-13.2-8-2.5-16.2-5-24.1-8-24.6-9.3-40.4-26-42.6-53.1-2.5-29.1 7.4-53.2 33.8-67 35.3-18.2 71.2-18 105.2 4.2 19.1 12.5 27.4 31.8 28.7 54.7h-44.5c-.8-13.7-8.2-22.9-20-29.4z"
                />
            </svg>
            <div tw="flex flex-col items-start justify-between">
                <h1 tw="pb-36 text-[10rem] font-normal">{searchParams.get('title')}</h1>
                <div tw="flex h-auto w-full flex-col items-start justify-center">
                    <h2 tw="mx-[-6px] text-8xl font-normal">{heading}</h2>
                    <h3 tw="w-1/3 text-3xl font-normal">{subheading}</h3>
                </div>
            </div>
        </div>
    );

    return new ImageResponse(image, {
        width: 1920,
        height: 1080,
        fonts: [
            {
                name: 'Poppins',
                data: fontData,
                style: 'normal',
                weight: 400,
            },
        ],
    });
}

export const config = {
    runtime: 'edge',
};

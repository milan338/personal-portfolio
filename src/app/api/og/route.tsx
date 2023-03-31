import { ImageResponse } from '@vercel/og';
import content from '@content/hero.content';
import type { NextRequest } from 'next/server';

export async function GET({ nextUrl }: NextRequest) {
    const { searchParams } = nextUrl;
    const { heading, subheading } = content;

    const bgURL = new URL('../../../../public/images/og-bg.png', import.meta.url);
    const fontBoldURL = new URL('../../../../public/fonts/poppins-bold.ttf', import.meta.url);
    const fontRegularURL = new URL('../../../../public/fonts/poppins-regular.ttf', import.meta.url);

    const resources = await Promise.all([fetch(fontRegularURL), fetch(fontBoldURL)]);
    const [fontDataRegular, fontDataBold] = await Promise.all(
        resources.map(async (resource) => resource.arrayBuffer())
    );

    const image = (
        <div
            tw="relative flex h-full w-full flex-col items-start justify-end p-32"
            style={{ backgroundImage: `url(${bgURL.toString()})` }}
        >
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
                tw="absolute bottom-32 right-32 rounded-lg"
                width={100}
                height={100}
                alt="logo"
                src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHhtbFNwYWNlPSJwcmVzZXJ2ZSIgdmlld0JveD0iMCAwIDUxMiA1MTIiPjxwYXRoIGQ9Ik0zMzUgNTEzSDFWMS4xaDUxMS44VjUxM0gzMzVtLTYwLTEzMS43IDQuMi0uMlYxMzUuM2MtMTIuNSAwLTI0LjguMS0zNy4xLS4xLTMuNSAwLTQuOSAxLjItNi4yIDQuMmwtNDggMTA3LjMtMzMuNyA3NS4xLTIuNC01LTE2LjktMzcuNi02Mi42LTEzOS42Yy0uOC0xLjctMi42LTQtNC00LjEtMTMtLjMtMjYuMi0uMi0zOS41LS4yVjM4MUg3MFYyMjUuNmwyLjkgNmMyMS42IDQ4LjYgNDMuMyA5Ny4xIDY0LjggMTQ1LjcgMS40IDMgMi45IDQuMyA2LjMgNC4xIDYuNi0uMyAxMy4zLS4zIDIwIDAgMy4yLjEgNC44LS44IDYuMi00bDU2LjktMTI4IDkuOS0yMS45LjguMnYxNTMuNkgyNzVtMTQ0LjYtMjA4LjdjMTEuNSA2LjMgMTguOSAxNS41IDE5LjcgMjkuMmg0NC41Yy0xLjMtMjIuOS05LjYtNDIuMi0yOC43LTU0LjctMzQtMjIuMi03MC0yMi40LTEwNS4yLTQuMS0yNi40IDEzLjctMzYuMyAzNy44LTMzLjggNjYuOSAyLjIgMjcgMTggNDMuOCA0Mi42IDUzLjIgNy45IDMgMTYgNS40IDI0IDggMTMuOCA0LjMgMjcuOCA4IDQxLjMgMTMuMSA5IDMuNCAxNiA5LjcgMTguNyAxOS41YTMyLjIgMzIuMiAwIDAgMS0xOS44IDM5LjQgNjEuNiA2MS42IDAgMCAxLTMyLjQgMyAzNi43IDM2LjcgMCAwIDEtMzIuMy0zMS4zYy0uNC0yLjMtLjYtNC42LS44LTdoLTQzLjFhNjUuNSA2NS41IDAgMCAwIDIyLjMgNTMuN2MxOC40IDE2LjMgNDAuNyAyMiA2NC42IDIyLjIgMjIuOC4xIDQzLjctNiA2MS40LTIxLjEgMzIuMi0yNy42IDM1LjQtOTEuNC0xOC0xMTIuMy0xMi4yLTQuOC0yNS04LTM3LjMtMTIuMy0xMS41LTQtMjMuMi03LjMtMzQtMTIuNS0xMS43LTUuNS0xNi42LTE1LjktMTUuMy0yOWEyOC44IDI4LjggMCAwIDEgMjAtMjUuNWMxMy44LTUgMjcuNS00LjMgNDEuNiAxLjZ6Ii8+PHBhdGggZmlsbD0iI0ZDRkNGQyIgZD0iTTI3NC42IDM4MS4zSDIzOFYyMjcuN2wtLjgtLjItMTAgMjJjLTE5IDQyLjYtMzggODUuMi01Ni44IDEyOC0xLjQgMy4xLTMgNC02LjIgMy45LTYuNy0uMy0xMy40LS4zLTIwIDAtMy40LjItNC45LTEtNi4zLTQtMjEuNS00OC43LTQzLjItOTcuMi02NC44LTE0NS43bC0yLjktNi4xVjM4MUgyOC44VjEzNS4zYzEzLjMgMCAyNi40LS4xIDM5LjUuMiAxLjQgMCAzLjIgMi40IDQgNC4xIDIxIDQ2LjUgNDEuOCA5MyA2Mi42IDEzOS42bDE3IDM3LjcgMi4zIDUgMzMuNy03NS4yIDQ4LTEwNy4zYzEuMy0zIDIuNy00LjMgNi4yLTQuMiAxMi4zLjIgMjQuNiAwIDM3LjEgMHYyNDUuOWwtNC42LjJ6Ii8+PHBhdGggZmlsbD0iI0ZERkRGRCIgZD0iTTQxOS40IDE3Mi40YTU1LjEgNTUuMSAwIDAgMC00MS4yLTEuNCAyOC44IDI4LjggMCAwIDAtMjAgMjUuNmMtMS40IDEzIDMuNSAyMy40IDE1LjEgMjguOSAxMC45IDUuMiAyMi42IDguNiAzNCAxMi41IDEyLjUgNC4yIDI1LjIgNy41IDM3LjQgMTIuMyA1My40IDIxIDUwLjIgODQuNyAxOCAxMTIuM2E5MC4yIDkwLjIgMCAwIDEtNjEuNCAyMWMtMjMuOSAwLTQ2LjItNS44LTY0LjYtMjJhNjUuNSA2NS41IDAgMCAxLTIyLjMtNTMuOGg0M2MuMyAyLjQuNSA0LjcuOSA3IDMgMTcuMiAxNSAyOC43IDMyLjMgMzEuMyAxMSAxLjYgMjIgMS4yIDMyLjQtM2EzMi4yIDMyLjIgMCAwIDAgMTkuOC0zOS40IDI4LjggMjguOCAwIDAgMC0xOC43LTE5LjVjLTEzLjUtNS0yNy41LTguOC00MS4yLTEzLjItOC0yLjUtMTYuMi01LTI0LjEtOC0yNC42LTkuMy00MC40LTI2LTQyLjYtNTMuMS0yLjUtMjkuMSA3LjQtNTMuMiAzMy44LTY3IDM1LjMtMTguMiA3MS4yLTE4IDEwNS4yIDQuMiAxOS4xIDEyLjUgMjcuNCAzMS44IDI4LjcgNTQuN2gtNDQuNWMtLjgtMTMuNy04LjItMjIuOS0yMC0yOS40eiIvPjwvc3ZnPgo="
            />
            <div tw="flex flex-col items-start justify-between">
                <h1 tw="pb-32 text-[10rem] font-normal">{searchParams.get('title')}</h1>
                <div tw="flex h-auto w-full flex-col items-start justify-center">
                    <h2 tw="mx-[-6px] text-7xl font-medium">{heading}</h2>
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
                data: fontDataBold,
                style: 'normal',
                weight: 500,
            },
            {
                name: 'Poppins',
                data: fontDataRegular,
                style: 'normal',
                weight: 400,
            },
        ],
    });
}

export const config = {
    runtime: 'edge',
};

const defaultTheme = require('tailwindcss/defaultTheme');
const fonts = require('./src/styles/fonts.json');

/**
 * @type {import('tailwindcss').Config}
 */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      transitionDuration: {
        3000: '3000ms',
      },
      fontFamily: {
        sans: [`var(${fonts['--font-poppins']})`, ...defaultTheme.fontFamily.sans],
      },
      width: {
        responsive: 'min(80vw, 48rem)',
      },
      opacity: {
        active: 1,
        hover: 0.6,
        inactive: 0.45,
      },
      data: {
        visible: 'visible="true"',
        invisible: 'visible="false"',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

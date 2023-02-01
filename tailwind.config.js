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
    },
  },
  plugins: [require('tailwindcss-animate')],
};

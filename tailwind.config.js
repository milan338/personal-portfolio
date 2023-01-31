const defaultTheme = require('tailwindcss/defaultTheme');
const fonts = require('./src/styles/fonts.json');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: [`var(${fonts['--font-poppins']})`, ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

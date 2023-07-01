const defaultTheme = require('tailwindcss/defaultTheme');

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
        sans: ['var(--font-poppins)', ...defaultTheme.fontFamily.sans],
      },
      width: {
        responsive: 'min(80vw, 48rem)',
      },
      opacity: {
        active: 1,
        hover: 0.6,
        inactive: 0.45,
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
};

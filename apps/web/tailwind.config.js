/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
    './shared-ui/**/*.{js,ts,jsx,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'Siora-dark': '#0A0A0A', // or your actual dark hex
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif', defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [],
};

import defaultTheme from 'tailwindcss/defaultTheme'


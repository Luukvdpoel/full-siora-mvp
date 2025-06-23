const base = require('../../tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [base],
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {},
  },
  plugins: [require('@tailwindcss/typography')],
};

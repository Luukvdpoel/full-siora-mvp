const base = require('../../tailwind.config.js');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [base],
  darkMode: 'media',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}

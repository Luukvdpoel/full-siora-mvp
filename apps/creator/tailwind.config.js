const preset = require('../../tailwind.config.js')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  darkMode: 'class',
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
}

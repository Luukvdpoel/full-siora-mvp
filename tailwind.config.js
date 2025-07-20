/** @type {import('tailwindcss').Config} */
const defaultTheme = require('tailwindcss/defaultTheme');

module.exports = {
  content: [
    './apps/**/*.{ts,tsx}',
    './packages/**/*.{ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        'Siora-dark': '#0f172a',
        'Siora-mid': '#1e293b',
        'Siora-light': '#334155',
        'Siora-border': '#3f3f46',
        'Siora-accent': '#6366f1',
        'Siora-accent-soft': '#818cf8',
      },
      boxShadow: {
        'Siora-hover': '0 8px 24px rgba(99, 102, 241, 0.2)',
      },
      borderRadius: {
        DEFAULT: '0.5rem',
        xl: '1rem',
        '2xl': '1.25rem',
      },
      fontSize: {
        xs: '0.75rem',
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
        xl: '1.25rem',
        '2xl': '1.5rem',
      },
      fontFamily: {
        sans: ['Inter', ...defaultTheme.fontFamily.sans],
      },
    },
  },
  plugins: [require('@tailwindcss/forms'), require('@tailwindcss/typography')],
};

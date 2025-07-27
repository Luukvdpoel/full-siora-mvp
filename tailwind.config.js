module.exports = {
  content: [
    "./apps/web/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'Siora-dark': '#111827',
        'Siora-mid': '#1f2937',
        'Siora-light': '#374151',
        'Siora-accent': '#6366F1',
        'Siora-accent-soft': '#818cf8',
        'Siora-border': '#4b5563',
        'Siora-hover': '#818cf8',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'Siora-hover': '0 4px 6px -1px rgba(129, 140, 248, 0.5), 0 2px 4px -1px rgba(129, 140, 248, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
    require('@tailwindcss/forms'),
  ],
};

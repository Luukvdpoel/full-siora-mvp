module.exports = {
  content: [
    "./apps/web/**/*.{js,ts,jsx,tsx}",
    "./packages/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'Siora-dark': '#0f172a',
        'Siora-mid': '#1e293b',
        'Siora-light': '#334155',
        'Siora-accent': '#7c3aed',
        'Siora-accent-soft': '#a78bfa',
        'Siora-border': '#475569',
        'Siora-hover': '#818cf8',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      },
      boxShadow: {
        'Siora-hover': '0 4px 6px -1px rgba(129, 140, 248, 0.5), 0 2px 4px -1px rgba(129, 140, 248, 0.5)',
      },
    },
  },
  plugins: [],
};

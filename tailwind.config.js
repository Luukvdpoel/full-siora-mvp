module.exports = {
  content: [
    "./apps/**/*.{ts,tsx}",
    "./packages/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        'Siora-dark': '#0D0F12',
        'Siora-mid': '#1e293b',
        'Siora-light': '#334155',
        'Siora-accent': '#6366F1',
        'Siora-accent-soft': '#4F46E5',
        'Siora-border': '#475569',
        'Siora-hover': '#818cf8',
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'sans-serif'],
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

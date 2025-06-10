import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "nura-dark": "#0f172a",       // deep navy/black
        "nura-mid": "#1e293b",        // middle dark gray
        "nura-light": "#334155",      // lighter slate
        "nura-border": "#3f3f46",     // subtle border gray
        "nura-accent": "#6366f1",     // indigo (Linear-style)
        "nura-accent-soft": "#818cf8", // lighter indigo (hover state)
      },
      boxShadow: {
        "nura-hover": "0 8px 24px rgba(99, 102, 241, 0.2)", // purple shadow
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        xl: "1rem",
        "2xl": "1.25rem",
      },
      fontSize: {
        xs: "0.75rem",
        sm: "0.875rem",
        base: "1rem",
        lg: "1.125rem",
        xl: "1.25rem",
        "2xl": "1.5rem",
      },
      fontFamily: {
        sans: ["Inter", "ui-sans-serif", "system-ui"],
      },
    },
  },
  plugins: [],
};

export default config;








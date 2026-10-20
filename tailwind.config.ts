import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        brand: {
          50: "rgb(var(--brand-50) / <alpha-value>)",
          100: "rgb(var(--brand-100) / <alpha-value>)",
          500: "rgb(var(--brand-500) / <alpha-value>)",
          600: "rgb(var(--brand-600) / <alpha-value>)",
          700: "rgb(var(--brand-700) / <alpha-value>)",
        },
        accent: "rgb(var(--accent-500) / <alpha-value>)",
      },
      borderRadius: { xl2: "21px" },
      spacing: { "13": "13px", "21": "21px", "34": "34px" },
    },
  },
  plugins: [],
};
export default config;

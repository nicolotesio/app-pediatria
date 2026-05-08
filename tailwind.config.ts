import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./data/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        clinic: {
          ink: "#1f2933",
          muted: "#64748b",
          line: "#d7dee8",
          surface: "#f6f8fb",
          teal: "#0f766e",
          blue: "#2563eb",
          amber: "#b45309",
          red: "#b91c1c"
        }
      },
      boxShadow: {
        soft: "0 10px 28px rgba(15, 23, 42, 0.08)"
      }
    }
  },
  plugins: []
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        dense: "var(--shadow-dense)",
      },
      backgroundColor: {
        dark: "#191919",
        light: "#f5f5f5"
      },
      textColor: {
        dark: "#d4d4d4",
        light: "#0f172a"
      }
    },
  },
  plugins: [],
};
export default config;

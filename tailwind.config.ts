import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      boxShadow: {
        dense: "rgb(var(--shadow-dense))",
      },
      colors: {
        'body': 'rgb(var(--body-color))',
        'sub-text': 'rgb(var(--sub-text-color))',
        'background': 'rgb(var(--background-color))',
        'primary': 'var(--color-primary)',
        'secondary': 'var(--color-secondary)',
      }
    },
  },
};
export default config;
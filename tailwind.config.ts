import type { Config } from "tailwindcss";
import colors from "tailwindcss/colors";

const denseShadow = `rgba(0, 0, 0, 0.07) 0px -1px 1px,
        rgba(0, 0, 0, 0.14) 0px 1px 1px,
        rgba(0, 0, 0, 0.07) 0px 2px 2px, 
        rgba(0, 0, 0, 0.07) 0px 4px 4px, 
        rgba(0, 0, 0, 0.07) 0px 8px 8px`;

const sharpShadow = `rgba(0, 0, 0, 0.07) 0px -1px 1px,
        rgba(0, 0, 0, 0.14) 0px 1px 1px,
        rgba(0, 0, 0, 0.07) 0px 2px 2px, 
        rgba(0, 0, 0, 0.07) 0px 4px 4px`;

// credit to uilabs.dev
const innerShineShadow = `0px 1px 0px 0px hsla(0,0%,100%,.03) inset, 
    0px 0px 0px 1px hsla(0,0%,100%,.03) inset, 
    0px 0px 0px 1px rgba(0,0,0,.1), 
    0px 2px 2px 0px rgba(0,0,0,.1), 
    0px 4px 4px 0px rgba(0,0,0,.1), 
    0px 8px 8px 0px rgba(0,0,0,.1), ${denseShadow}`;

// not sure why the /.5 works here, that should send it out of bounds, src: joebell.studio
const sheenShadow = `0 -1px 0 rgb(180, 197, 202), 
0 0 0 1px rgba(180, 197, 202, 0.5), 
${denseShadow}`;

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/views/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    colors: {
      transparent: "transparent",
      current: "currentColor",
      black: colors.black,
      white: colors.white,
      purple: colors.purple,
      lime: colors.lime,
      slate: colors.slate,
      gray: {
        ...colors["gray"],
        "900": "#1A1A1A",
        "950": "#0F0F0F",
      },
    },

    extend: {
      boxShadow: {
        dense: denseShadow,
        "inner-shine": innerShineShadow,
        sheen: sheenShadow,
        sharp: sharpShadow,
      },
    },
  },
};

export default config;

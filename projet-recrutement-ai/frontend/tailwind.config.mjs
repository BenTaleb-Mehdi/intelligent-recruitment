import { heroui } from "@heroui/theme";

/** @type {import('tailwindcss').Config} */
const config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./node_modules/@heroui/theme/dist/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  darkMode: "class",
  plugins: [
    heroui({
      themes: {
        light: {
          colors: {
            background: "#FFFFFF",
            foreground: "#171717",
            content1: "#FFFFFF",
            default: {
              50: "#FAFAFA",
              100: "#F4F4F5",
              200: "#E4E4E7",
              300: "#D4D4D8",
              400: "#A1A1AA",
              500: "#71717A",
              600: "#52525B",
              700: "#3F3F46",
              800: "#27272A",
              900: "#18181B",
            },
          },
        },
        dark: {
          colors: {
            background: "#151A22",
            foreground: "#EDEDED",
            content1: "#151A22",
            default: {
              50: "#18181B",
              100: "#27272A",
              200: "#3F3F46",
              300: "#52525B",
              400: "#71717A",
              500: "#A1A1AA",
              600: "#D4D4D8",
              700: "#E4E4E7",
              800: "#F4F4F5",
              900: "#FAFAFA",
            },
          },
        },
      },
    }),
  ],
};

export default config;
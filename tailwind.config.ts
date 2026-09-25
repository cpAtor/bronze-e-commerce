import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        parchment: {
          50: "#FAF7F2",
          100: "#F5F0E8", // primary parchment
          200: "#EBE3D5",
          300: "#DDD1BC",
          400: "#C9BAA0",
        },
        bronze: {
          50: "#F7F3F0",
          100: "#ECE2DC",
          200: "#D3BDB1",
          300: "#B89684",
          500: "#7A5544",
          700: "#5C4033", // primary dark bronze
          800: "#442E24",
          900: "#2F1E17",
          950: "#1C110C",
        },
        gold: {
          300: "#EAD695",
          400: "#DFCA83",
          500: "#C8A951", // primary accent gold
          600: "#A98B35",
          700: "#866D24",
        },
        patina: {
          500: "#4A7C59",
          600: "#366043",
        },
      },
      fontFamily: {
        serif: ["var(--font-cinzel)", "Georgia", "Cambria", "serif"],
        sans: ["var(--font-inter)", "system-ui", "-apple-system", "sans-serif"],
      },
      minHeight: {
        tap: "44px",
      },
      minWidth: {
        tap: "44px",
      },
    },
  },
  plugins: [],
};

export default config;

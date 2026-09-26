import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        // Shopify Heritage Theme exact color schemes
        heritage: {
          dark: '#202219', // Primary background (Scheme 1: rgb(32 34 25))
          darker: '#161811',
          surface: '#2A2C21',
          moss: '#46493C', // Accent background (Scheme 3: rgb(70 73 60))
          contrast: '#383A30', // Split section contrast
          cream: '#F6EDDD', // Primary foreground (rgb(246 237 221))
          'cream-hover': '#E1D9CB',
          muted: 'rgba(246, 237, 221, 0.65)',
          subtle: 'rgba(246, 237, 221, 0.40)',
          border: 'rgba(246, 237, 221, 0.18)',
          'border-light': 'rgba(246, 237, 221, 0.10)',
          // Authentic Panchaloha finishes
          bronze: '#8C6D58',
          gold: '#C8A951',
          patina: '#4A7C59',
        },
      },
      fontFamily: {
        sans: ['var(--font-instrument-sans)', 'system-ui', '-apple-system', 'sans-serif'],
        heading: ['var(--font-instrument-sans)', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        display: '-0.03em',
        subheading: '0.12em',
      },
      borderRadius: {
        pill: '100px',
      },
      minHeight: {
        tap: '44px',
      },
      minWidth: {
        tap: '44px',
      },
    },
  },
  plugins: [],
};

export default config;

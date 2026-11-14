// ponytail: Strict 4*x spacing and 60-30-10 palette tokens, no throwaway utility bloat
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['"Be Vietnam Pro"', 'Inter', 'system-ui', 'sans-serif'],
        academic: ['"Times New Roman"', 'Times', '"STIX Two Text"', 'serif'],
        serif: ['Literata', 'Merriweather', 'serif'],
        mono: ['"JetBrains Mono"', 'monospace'],
      },
      colors: {
        canvas: {
          light: '#f8fafc', // 60% Dominant Light
          dark: '#0c0d10',  // 60% Dominant Dark (Deep contrast)
        },
        surface: {
          light: '#ffffff', // 30% Secondary Surface Light
          dark: '#15161b',  // 30% Secondary Surface Dark (Distinct Card)
        },
        borderSubtle: {
          light: '#e2e8f0', // 1px Hairline Border Light
          dark: '#282a35',  // 1px Hairline Border Dark
        },
        accent: {
          primary: '#991b1b',      // 10% Academic Crimson Light
          primaryDark: '#f87171',  // 10% Academic Crimson Dark
        }
      },
      maxWidth: {
        reading: '720px', // 4 * 180px: Optimal reading width
      }
    },
  },
  plugins: [],
};

import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        gold: 'var(--brand-gold)',
        teal: 'var(--brand-teal)',
        plum: 'var(--brand-plum)',
        cream: 'var(--brand-cream)',
        sand: 'var(--brand-sand)',
        green: 'var(--brand-green)',
      },
    },
  },
  plugins: [],
}

export default config
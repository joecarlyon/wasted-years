import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './lib/**/*.{js,ts}',
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          dark: '#0a0a0f',
          card: '#14141c',
          hover: '#1e1e2a',
        },
        text: {
          primary: '#e8e8f0',
          secondary: '#c8d0e4',
        },
        accent: {
          DEFAULT: '#c9a227',
          dark: '#a68521',
          light: '#e3b832',
        },
        lavender: {
          DEFAULT: '#9ca8d8',
          dark: '#7b88b8',
          light: '#b8c2e8',
        },
        border: '#2a2a3a',
        status: {
          success: '#4a8c5e',
          warning: '#c9a227',
          error: '#a84444',
        },
      },
      fontFamily: {
        sans: ['Segoe UI', 'Tahoma', 'Geneva', 'Verdana', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

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
          dark: 'rgb(var(--color-bg-dark) / <alpha-value>)',
          card: 'rgb(var(--color-bg-card) / <alpha-value>)',
          hover: 'rgb(var(--color-bg-hover) / <alpha-value>)',
        },
        text: {
          primary: 'rgb(var(--color-text-primary) / <alpha-value>)',
          secondary: 'rgb(var(--color-text-secondary) / <alpha-value>)',
        },
        accent: {
          DEFAULT: 'rgb(var(--color-accent) / <alpha-value>)',
          dark: 'rgb(var(--color-accent-dark) / <alpha-value>)',
          light: 'rgb(var(--color-accent-light) / <alpha-value>)',
        },
        lavender: {
          DEFAULT: 'rgb(var(--color-lavender) / <alpha-value>)',
          dark: 'rgb(var(--color-lavender-dark) / <alpha-value>)',
          light: 'rgb(var(--color-lavender-light) / <alpha-value>)',
        },
        border: 'rgb(var(--color-border) / <alpha-value>)',
        status: {
          success: 'rgb(var(--color-status-success) / <alpha-value>)',
          warning: 'rgb(var(--color-status-warning) / <alpha-value>)',
          error: 'rgb(var(--color-status-error) / <alpha-value>)',
        },
      },
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}

export default config

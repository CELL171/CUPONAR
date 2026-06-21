import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./src/**/*.{js,ts,jsx,tsx,mdx}'],
  theme: {
    extend: {
      colors: {
        bg: '#f7f4ec',
        paper: '#fffdf7',
        ink: '#0a2540',
        'ink-soft': '#2a3f5f',
        muted: '#6b7280',
        line: '#e6e1d4',
        'line-strong': '#d4cdb8',
        accent: '#ffd60a',
        'accent-deep': '#f5b800',
        good: '#15803d',
        bad: '#b91c1c',
      },
      fontFamily: {
        display: ['var(--font-display)', 'system-ui', 'sans-serif'],
        body: ['var(--font-body)', 'system-ui', 'sans-serif'],
        mono: ['var(--font-mono)', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        card: '0 1px 2px rgba(10, 37, 64, .04), 0 8px 24px -12px rgba(10, 37, 64, .12)',
        'card-hover': '0 2px 4px rgba(10,37,64,.05), 0 12px 32px -12px rgba(10,37,64,.2)',
      },
    },
  },
  plugins: [],
};

export default config;

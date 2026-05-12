import type { Config } from 'tailwindcss'

export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        kanit: ['Kanit', 'sans-serif'],
        display: ['"Instrument Serif"', 'serif'],
        sora: ['Kanit', 'sans-serif'], // alias for backward compat
      },
      colors: {
        // New palette
        bg:      '#0C0C0C',
        text:    '#f5f5f5',
        muted:   '#888888',
        stroke:  '#1f1f1f',
        // Brand glow colors
        brand: {
          magenta: '#B600A8',
          purple:  '#7621B0',
          orange:  '#BE4C00',
          ice:     '#BBCCD7',
          mist:    '#D7E2EA',
        },
        // shadcn / legacy tokens
        border: 'hsl(var(--border))',
        input: 'hsl(var(--input))',
        ring: 'hsl(var(--ring))',
        background: 'hsl(var(--background))',
        foreground: 'hsl(var(--foreground))',
        primary: {
          DEFAULT: 'hsl(var(--primary))',
          foreground: 'hsl(var(--primary-foreground))',
        },
        secondary: {
          DEFAULT: 'hsl(var(--secondary))',
          foreground: 'hsl(var(--secondary-foreground))',
        },
        'muted-foreground': 'hsl(var(--muted-foreground))',
        accent: {
          DEFAULT: 'hsl(var(--accent))',
          foreground: 'hsl(var(--accent-foreground))',
        },
        destructive: {
          DEFAULT: 'hsl(var(--destructive))',
          foreground: 'hsl(var(--foreground))',
        },
        'hero-bg': '#0C0C0C',
      },
      borderRadius: {
        lg: 'var(--radius)',
        md: 'calc(var(--radius) - 2px)',
        sm: 'calc(var(--radius) - 4px)',
        '2xl': '1.25rem',
        '3xl': '1.75rem',
        '4xl': '2.25rem',
      },
      boxShadow: {
        'glow-sm': '0 0 18px rgba(118, 33, 176, 0.35)',
        'glow-md': '0 0 36px rgba(118, 33, 176, 0.45), 0 0 8px rgba(182, 0, 168, 0.25)',
        'glow-lg': '0 0 72px rgba(118, 33, 176, 0.55), 0 0 24px rgba(190, 76, 0, 0.30)',
        'glow-ice': '0 0 28px rgba(187, 204, 215, 0.30)',
        'inset-glow': 'inset 0 0 24px rgba(118, 33, 176, 0.18)',
      },
      backgroundImage: {
        'brand-gradient':
          'linear-gradient(123deg, #18011F 7%, #B600A8 37%, #7621B0 72%, #BE4C00 100%)',
        'brand-soft':
          'linear-gradient(123deg, rgba(182,0,168,0.18) 7%, rgba(118,33,176,0.22) 50%, rgba(190,76,0,0.18) 100%)',
        'grid-faint':
          'linear-gradient(rgba(255,255,255,0.025) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.025) 1px, transparent 1px)',
      },
      keyframes: {
        'fade-up': {
          '0%': { opacity: '0', transform: 'translateY(20px)', filter: 'blur(4px)' },
          '100%': { opacity: '1', transform: 'translateY(0)', filter: 'blur(0)' },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        'ambient-drift-a': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%':      { transform: 'translate3d(8vw, 6vh, 0) scale(1.08)' },
        },
        'ambient-drift-b': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(1)' },
          '50%':      { transform: 'translate3d(-6vw, -8vh, 0) scale(1.12)' },
        },
        'ambient-drift-c': {
          '0%, 100%': { transform: 'translate3d(0, 0, 0) scale(0.9)' },
          '50%':      { transform: 'translate3d(-5vw, 4vh, 0) scale(1.05)' },
        },
        'glow-pulse': {
          '0%, 100%': { opacity: '0.6' },
          '50%':      { opacity: '1' },
        },
        'gradient-pan': {
          '0%, 100%': { backgroundPosition: '0% 50%' },
          '50%':      { backgroundPosition: '100% 50%' },
        },
        'tilt-shine': {
          '0%':   { transform: 'translateX(-110%) skewX(-15deg)' },
          '100%': { transform: 'translateX(220%) skewX(-15deg)' },
        },
      },
      animation: {
        'fade-up': 'fade-up 0.7s cubic-bezier(0.16, 1, 0.3, 1) forwards',
        'fade-in': 'fade-in 0.5s ease-out forwards',
        'glow-pulse': 'glow-pulse 3.5s ease-in-out infinite',
        'gradient-pan': 'gradient-pan 8s ease infinite',
        'tilt-shine': 'tilt-shine 1.2s ease-out',
      },
    },
  },
  plugins: [require('tailwindcss-animate')],
} satisfies Config

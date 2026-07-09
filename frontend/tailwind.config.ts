import type { Config } from 'tailwindcss'

export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Gilroy', 'Montserrat', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SF Mono', 'monospace'],
      },
      fontWeight: {
        '300': '300',
        '400': '400',
        '500': '500',
        '600': '600',
        '700': '700',
        '800': '800',
      },
      colors: {
        canvas:          'var(--canvas)',
        s1:              'var(--s1)',
        s2:              'var(--s2)',
        s3:              'var(--s3)',
        hl:              'var(--hl)',
        'hl-strong':     'var(--hl-strong)',
        ink:             'var(--ink)',
        'ink-muted':     'var(--ink-muted)',
        'ink-subtle':    'var(--ink-subtle)',
        'ink-tertiary':  'var(--ink-tertiary)',
        accent:          'var(--accent)',
        'accent-hover':  'var(--accent-hover)',
        'accent-focus':  'var(--accent-focus)',
        barrel:          'var(--barrel)',
        'barrel-dim':    'var(--barrel-dim)',
        success:         'var(--success)',
        danger:          'var(--danger)',
      },
      fontSize: {
        'display':    ['clamp(2.5rem,6vw,4.5rem)', { lineHeight: '1.05', letterSpacing: '-0.04em', fontWeight: '800' }],
        'headline':   ['1.875rem',  { lineHeight: '1.18', letterSpacing: '-0.03em', fontWeight: '700' }],
        'card-title': ['1.25rem',   { lineHeight: '1.25', letterSpacing: '-0.02em', fontWeight: '600' }],
        'body-lg':    ['1.0625rem', { lineHeight: '1.6',  letterSpacing: '-0.005em' }],
        'body':       ['0.9375rem', { lineHeight: '1.6',  letterSpacing: '0' }],
        'caption':    ['0.8125rem', { lineHeight: '1.4',  letterSpacing: '0' }],
        'eyebrow':    ['0.6875rem', { lineHeight: '1.3',  letterSpacing: '0.12em', fontWeight: '600' }],
      },
      borderRadius: {
        sm:   '8px',
        md:   '12px',
        lg:   '16px',
        xl:   '20px',
        '2xl':'24px',
        '3xl':'32px',
        pill: '9999px',
        full: '9999px',
      },
      borderColor: {
        DEFAULT: 'var(--hl)',
      },
      keyframes: {
        'fade-up': {
          '0%':   { opacity: '0', transform: 'translateY(14px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        'barrel-pulse': {
          '0%, 100%': { opacity: '1' },
          '50%':      { opacity: '0.55' },
        },
        'slide-in-left': {
          '0%':   { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' },
        },
      },
      animation: {
        'fade-up':       'fade-up 0.55s cubic-bezier(0.16,1,0.3,1) both',
        'barrel-pulse':  'barrel-pulse 2s ease-in-out infinite',
        'slide-in-left': 'slide-in-left 0.3s cubic-bezier(0.16,1,0.3,1) both',
      },
    },
  },
  plugins: [],
} satisfies Config

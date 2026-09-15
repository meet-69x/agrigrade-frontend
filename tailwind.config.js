/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0B0D0A',
          surface: '#14170F',
          card: 'rgba(255, 255, 255, 0.035)',
          border: '#2A2E22',
          'border-light': 'rgba(255, 255, 255, 0.08)',
        },
        lime: {
          DEFAULT: '#D4FF3F',
          hover: '#C2F02B',
          glow: 'rgba(212, 255, 63, 0.25)',
          light: '#F3FFC2',
        },
        amber: {
          DEFAULT: '#FFB800',
        },
        rust: {
          DEFAULT: '#FF4444',
        },
        accent: {
          orange: '#FF6B35',
        },
        ink: {
          primary: '#F4F1E8',
          muted: '#8C9080',
          dark: '#0B0D0A',
        },
        grade: {
          a: '#D4FF3F',
          b: '#FFB800',
          c: '#FF4444',
        }
      },
      fontFamily: {
        display: ['Clash Display', 'Cabinet Grotesk', 'sans-serif'],
        sans: ['Satoshi', 'Inter', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      boxShadow: {
        'lime-glow': '0 0 25px rgba(212, 255, 63, 0.25)',
        'lime-glow-lg': '0 0 45px rgba(212, 255, 63, 0.35)',
        'dark-card': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
      },
      animation: {
        'marquee': 'marquee 25s linear infinite',
        'pulse-glow': 'pulseGlow 3s ease-in-out infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: 0.3 },
          '50%': { opacity: 0.7 },
        }
      }
    },
  },
  plugins: [],
}

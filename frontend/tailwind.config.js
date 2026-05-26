/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class',
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          primary: {
            DEFAULT: '#6366f1',
            500: '#6366f1',
            600: '#4f46e5',
          },
          secondary: {
            DEFAULT: '#8b5cf6',
            500: '#8b5cf6',
            600: '#7c3aed',
          },
          accent: {
            DEFAULT: '#06b6d4',
            400: '#22d3ee',
            500: '#06b6d4',
          }
        },
        status: {
          success: {
            DEFAULT: '#10b981',
            400: '#34d399',
            500: '#10b981',
          },
          warning: {
            DEFAULT: '#f59e0b',
            400: '#fbbf24',
            500: '#f59e0b',
          },
          error: {
            DEFAULT: '#f43f5e',
            400: '#fb7185',
            500: '#f43f5e',
          },
          info: {
            DEFAULT: '#0ea5e9',
            400: '#38bdf8',
            500: '#0ea5e9',
          }
        }
      },
      animation: {
        'pulse-slow': 'pulse 3s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'fade-in': 'fadeIn 0.2s ease-out',
        'slide-up': 'slideUp 0.25s ease-out',
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
        slideUp: {
          from: { opacity: 0, transform: 'translateY(12px)' },
          to: { opacity: 1, transform: 'translateY(0)' },
        },
      },
      backdropBlur: {
        xs: '2px',
      },
      boxShadow: {
        'glass': '0 4px 24px rgba(0, 0, 0, 0.06), 0 1px 2px rgba(0, 0, 0, 0.04)',
        'glass-dark': '0 4px 24px rgba(0, 0, 0, 0.4), 0 1px 2px rgba(0, 0, 0, 0.3)',
        'glow': '0 0 20px rgba(99, 102, 241, 0.25)',
      },
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
      colors: {
        brand: {
          500: '#6366f1',
          600: '#4f46e5',
          700: '#4338ca',
        },
        surface: {
          950: '#090912',
          900: '#0f0f1a',
          800: '#16162a',
          700: '#1e1e35',
          600: '#292945',
        },
      },
      boxShadow: {
        glass: '0 18px 70px rgba(0, 0, 0, 0.32)',
        glow: '0 0 0 1px rgba(99, 102, 241, 0.18), 0 18px 60px rgba(79, 70, 229, 0.18)',
      },
      keyframes: {
        fadeIn: {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
      },
      animation: {
        'fade-in': 'fadeIn 180ms ease-out both',
        'slide-up': 'slideUp 220ms ease-out both',
      },
    },
  },
  plugins: [],
}

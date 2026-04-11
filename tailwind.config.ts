import type { Config } from 'tailwindcss'

export default <Config>{
  content: [
    './components/**/*.{js,vue,ts}',
    './layouts/**/*.vue',
    './pages/**/*.vue',
    './plugins/**/*.{js,ts}',
    './app.vue',
    './error.vue'
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: '#F0F7FF',
          100: '#E0EDFF',
          200: '#C9DCFF',
          300: '#A5C4FF',
          400: '#7BA3FF',
          500: '#5282FF',
          600: '#2966FF',
          700: '#0051E6',
          800: '#0040B8',
          900: '#00308A',
          DEFAULT: '#007AFF'
        },
        surface: {
          50: '#FAFCFF',
          100: '#F4F9FF',
          200: '#E8F3FF',
          300: '#D1EAFF',
          400: '#A5D4FF',
          500: '#7BA3FF',
          DEFAULT: '#F4F9FF'
        }
      },
      fontFamily: {
        sans: ['Outfit', 'system-ui', 'sans-serif']
      },
      animation: {
        'fade-in-up': 'fadeInUp 0.5s cubic-bezier(0.16, 1, 0.3, 1)',
        'scale-in': 'scaleIn 0.3s cubic-bezier(0.16, 1, 0.3, 1)',
        'slide-in': 'slideIn 0.4s cubic-bezier(0.16, 1, 0.3, 1)',
        'shimmer': 'shimmer 2s linear infinite'
      },
      keyframes: {
        fadeInUp: {
          '0%': { opacity: '0', transform: 'translateY(12px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' }
        },
        scaleIn: {
          '0%': { opacity: '0', transform: 'scale(0.95)' },
          '100%': { opacity: '1', transform: 'scale(1)' }
        },
        slideIn: {
          '0%': { opacity: '0', transform: 'translateX(-8px)' },
          '100%': { opacity: '1', transform: 'translateX(0)' }
        },
        shimmer: {
          '0%': { backgroundPosition: '-200% 0' },
          '100%': { backgroundPosition: '200% 0' }
        }
      },
      boxShadow: {
        'glow': '0 0 40px rgba(0, 122, 255, 0.15)',
        'glow-md': '0 0 24px rgba(0, 122, 255, 0.12)',
        'glow-sm': '0 0 12px rgba(0, 122, 255, 0.08)',
        'card': '0 4px 24px -2px rgba(0, 0, 0, 0.06), 0 0 0 1px rgba(0, 0, 0, 0.04)'
      }
    }
  },
  plugins: []
}
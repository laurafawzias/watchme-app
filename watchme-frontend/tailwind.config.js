/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html", "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      animation: {
        'slideDown': 'slideDown 0.3s ease-out forwards',
        'slideUp': 'slideUp 0.3s ease-out forwards'
      },
      keyframes: {
        slideDown: {
          '0%': { maxHeight: '0', opacity: '0' },
          '100%': { maxHeight: '600px', opacity: '1' }
        },
        slideUp: {
          '0%': { maxHeight: '600px', opacity: '1' },
          '100%': { maxHeight: '0', opacity: '0' }
        }
      }
    },
  },
  plugins: [],
}


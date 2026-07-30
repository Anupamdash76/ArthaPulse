/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // For theme toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          900: '#0B1220',
          800: '#111827',
          700: '#1A2333',
          600: '#232E42',
        },
        accent: {
          DEFAULT: '#F59E0B',
          hover: '#D97706',
          success: '#22C55E',
          loss: '#EF4444',
        }
      },
      fontFamily: {
        'lora': ['Lora', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
        'sans': ['Plus Jakarta Sans', 'Inter', 'sans-serif'],
      },
      boxShadow: {
        'glow-amber': '0 0 20px -5px rgba(245, 158, 11, 0.25)',
        'card': '0 10px 30px -10px rgba(0, 0, 0, 0.4)',
      }
    },
  },
  plugins: [],
}
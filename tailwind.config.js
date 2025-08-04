/** @type {import('tailwindcss').Config} */
export default {
  darkMode: 'class', // For theme toggling
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // For custom fonts
        'lora': ['Lora', 'serif'],
        'montserrat': ['Montserrat', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
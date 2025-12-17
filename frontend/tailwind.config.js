/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: '#ff385c',
          500: '#ff385c',
          400: '#ff5e78',
          600: '#e02b4b'
        }
      }
    }
  },
  darkMode: 'class',
  plugins: []
}

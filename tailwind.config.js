/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#F3F6F8',
          100: '#AACDDC',
          200: '#CFE8F2',
          500: '#81A6C6',
          600: '#6E8FAE',
        },
        secondary: {
          50: '#F9FBFB',
          100: '#AACDDC',
          500: '#AACDDC'
        },
        bgpalette: {
          DEFAULT: '#F3E3D0'
        },
        accent: {
          DEFAULT: '#D2C4B4'
        },
      },
    },
  },
  plugins: [],
}

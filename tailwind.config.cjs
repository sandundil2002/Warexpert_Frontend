/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "primary-blue": "#1E3A8A",
        "dark-blue": "#1E293B",
        "primary-orange": "#F97316",
        "light-gray": "#F3F4F6",
        "white": "#FFFFFF",
        "dark-gray": "#111827",
      },
    },
  },
  plugins: [],
}
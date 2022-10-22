/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        mc: {
          100: "#C5C6C6",
          200: "#A9A9A9",
          300: "#888888",
          400: "#6F6E6F",
          500: "#5D5D5D",
          600: "#4B4B4B",
          700: "#3B3B3B",
          800: "#2A2A2A",
          900: "#1C1C1C",
        },
      },
    },
  },
  plugins: [],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  darkMode: ["class"],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      keyframes: {
        "accordion-down": {
          from: { height: 0 },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: 0 },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
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
  plugins: [require("tailwindcss-animate")],
};

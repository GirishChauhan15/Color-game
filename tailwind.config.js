/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    screens: {
      xsm: "300px",
      sm: "640px",
      md: "768px",
      lg: "1024px",
      xl: "1280px",
    },
    extend: {},
    fontFamily: {
      serif: ["serif"],
      start2P: ['"Press Start 2P"', "system-ui"],
      lato: ["Lato", "sans-serif"],
    },
  },
  plugins: [],
};

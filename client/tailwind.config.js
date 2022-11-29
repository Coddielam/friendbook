/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        green: "#57886C",
        blue: "#3E78B2",
      },
      spacing: {
        btn: "0.25rem",
      },
      borderRadius: {
        btn: "0.25rem",
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

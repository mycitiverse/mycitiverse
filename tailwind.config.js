/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        gold: '#FFD700'
      },
      fontFamily: {
      sans: ['Inter', 'sans-serif'],
    },
  },
},
variants: {},
  plugins: [
  require("@tailwindcss/forms"),
  require("@tailwindcss/typography")
  ],
};


module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
    './src/**/*.{html,js}', './node_modules/tw-elements/dist/js/**/*.js',
  ],
  theme: {
    extend: {
      screens: {
        m28: "280px",
        m37: "375px",
        m41: "420px",
        m48: "480px",
        sm: "620px",
        md: "768px",
        lg: "1024px",
        l25: "1025px",
        l32: "1032px",
        x2: "1200px",
        xl: "1280px",
        xxl: "1536px"
      },
      fontFamily: {
        raleway: ["Raleway", "sans-serif"],
        opensans: ['"Open Sans"', "sans-serif"],
        poppins: ["Poppins", "sans-serif"],
      },
      colors: {
        fontblue: "hsl(243, 87%, 12%)",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp") ,require('tw-elements/dist/plugin')
],
}
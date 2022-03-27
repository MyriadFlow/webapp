module.exports = {
  mode: "jit",
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./Components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'raleway': ['Raleway', 'sans-serif'],
        'opensans': ['"Open Sans"', 'sans-serif']
      },
      colors: {
        'fontblue': 'hsl(243, 87%, 12%)',
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        'rubik': ['Rubik', 'sans']
      },
      colors: {
        'myVerydarkgrey': 'hsl(0, 0%, 17%)',
        'myDarkgrey': 'hsl(0, 0%, 59%)',
      }
    }
  },
  plugins: [],
}

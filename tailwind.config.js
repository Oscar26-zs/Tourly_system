/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#2082AA',
        secondary: '#00695C',
        dark: '#1E1E1E',
        gray: '#B3B3B3',
      },
      fontFamily: {
        sans: ['Montserrat', 'ui-sans-serif', 'system-ui'],
        inter: ['Inter', 'ui-sans-serif', 'system-ui'],
        poppins: ['Poppins', 'ui-sans-serif', 'system-ui'],
      },
    },
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./*.html'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1020px',
      xl: '1440px',
    },
    extend: {
      colors: {
        blueGrey: '#324453',
        blueBg: '#1F2434',
        slateHov: '#183750',
        lightSlate: '#56626B',
        ice: '#8BE2FD',
        darkerIce: '#7CAACE',
        plain: '#D9D9D9',
        error: '#F57373',
        errorHov: '#DE5050',
        success: '#77B373',
        successHov: '#4DAB47',
        blueText: '#1F5886'
      },
      fontFamily: {
        sans: ['Dosis', 'sans-serif']
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

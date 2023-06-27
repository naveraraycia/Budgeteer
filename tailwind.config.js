/** @type {import('tailwindcss').Config} */
module.exports = {
  mode: 'jit',
  content: ['./*.html'],
  theme: {
    screens: {
      sm: '480px',
      md: '768px',
      lg: '1020px',
      xl: '1440px',
    },
    purge: [
      './public/**/*.html',
      './src/**/*.{js,jsx,ts,tsx,vue}',
    ],
    extend: {
      colors: {
        creme: '#FEF3E1',
        offWhite: '#FFFAF1',
        primary: '#F9AC58',
        overlay: 'rgba(91,80,63,.46)',
        slateHov: '#183750',
        ice: '#24A0C7',
        lightBrown: '#605959',
        error: '#F57373',
        errorHov: '#DE5050',
        success: '#77B373',
        successHov: '#4DAB47'
      },
      fontFamily: {
        sans: ['Dosis', 'sans-serif']
      }
    },
  },
  plugins: [require("@tailwindcss/forms")],
}

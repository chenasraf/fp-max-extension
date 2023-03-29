const defaultTheme = require('tailwindcss/defaultTheme')
const colors = require('tailwindcss/colors')
const typography = require('@tailwindcss/typography')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  plugins: [typography],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Proxima Nova', ...defaultTheme.fontFamily.sans],
      },
      colors: {
        transparent: 'transparent',
        current: 'currentColor',
        primary: { ...colors.blue, DEFAULT: colors.blue[500] },
        secondary: { ...colors.green, DEFAULT: colors.green[600] },
        background: { ...colors.gray, DEFAULT: colors.gray[50] },
        text: { ...colors.slate, DEFAULT: colors.slate[900] },
        error: { ...colors.red, DEFAULT: colors.red[600] },
        success: { ...colors.green, DEFAULT: colors.green[300] },
        warning: { ...colors.yellow, DEFAULT: colors.yellow[300] },
      },
    },
  },
}

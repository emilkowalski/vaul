const colors = require('tailwindcss/colors');
const defaultTheme = require('tailwindcss/defaultTheme');

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
    './mdx-components.tsx',
  ],
  future: {
    hoverOnlyWhenSupported: true,
  },
  theme: {
    extend: {
      colors: {
        gray: { ...colors.zinc },
        main: 'hsl(0, 0, 100%)',
        subtle: 'hsl(0, 0, 98%)',
        'el-bg': 'hsl(0, 0, 98%)',
        'el-hover-bg': 'hsl(0, 0, 94%)',
        'el-active-bg': 'hsl(0, 0, 90%)',
        'transparent-border': 'hsl(0, 0, 92%)',
        'transparent-border-hover': 'hsl(0, 0, 86%)',
        'transparent-border-active': 'hsl(0, 0, 82%)',
        'solid-border': 'hsl(0, 0, 92%)',
        'solid-border-hover': 'hsl(0, 0, 86%)',
        'solid-border-active': 'hsl(0, 0, 82%)',
        primary: 'hsl(240, 6, 10%)',
        secondary: 'hsl(240, 5, 34%)',
        tertiary: 'hsl(240, 5, 65%)',
      },
    },
  },
};

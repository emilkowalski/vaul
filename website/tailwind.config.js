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
        main: 'var(--main)',
        subtle: 'var(--subtle)',
        'el-bg': 'var(--el-bg)',
        'el-hover-bg': 'var(--el-hover-bg)',
        'el-active-bg': 'var(--el-active-bg)',
        'transparent-border': 'var(--transparent-border)',
        'transparent-border-hover': 'var(--transparent-border-hover)',
        'transparent-border-active': 'var(--transparent-border-active)',
        'solid-border': 'var(--solid-border)',
        'solid-border-hover': 'var(--solid-border-hover)',
        'solid-border-active': 'var(--solid-border-active)',
        primary: 'var(--primary)',
        secondary: 'var(--secondary)',
        tertiary: 'var(--tertiary)',
        disabled: 'var(--disabled)',
      },
    },
    fontFamily: {
      mono: ['var(--font-mono)'],
    },
    boxShadow: {
      DEFAULT: 'var(--ds-shadow-border-medium)',
      border: 'var(--ds-shadow-border)',
      base: 'var(--ds-shadow-base)',
      sm: 'var(--ds-shadow-border-small)',
      md: 'var(--ds-shadow-border-medium)',
      lg: 'var(--ds-shadow-border-large)',
      tooltip: 'var(--ds-shadow-tooltip)',
      menu: 'var(--ds-shadow-menu)',
      modal: 'var(--ds-shadow-modal)',
      fullscreen: 'var(--ds-shadow-fullscreen)',
      'focus-ring': 'var(--ds-focus-ring)',
      'focus-ring-button': 'var(--ds-focus-ring-button)',
      'inset-border': 'var(--ds-inset-border)',
      'inset-border-light': 'var(--ds-inset-border-light)',
    },
  },
};

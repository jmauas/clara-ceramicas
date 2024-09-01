/** @type {import('tailwindcss').Config} */
export const content = [
  "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
  "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
];
export const theme = {
  extend: {
    backgroundImage: {
      "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
      "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
    },
    fontFamily: {
      trebu: ['Trebuchet MS', 'sans-serif'], 
    },
    keyframes: {
      bounce: {
        '0%, 100%': {
          'transform': 'translateY(-15%)',
          'animation-timing-function': 'cubic-bezier(0.8, 0, 1, 1)',
        },
        '50%': {
          'transform': 'translateY(0)',
          'animation-timing-function': 'cubic-bezier(0, 0, 0.2, 1)'
        },
      },
      pulse: {
        '0%': { 'opacity': '0' },
        '10%': { 'opacity': '0.1' },
        '20%': { 'opacity': '0.2' },
        '30%': { 'opacity': '0.3' },
        '40%': { 'opacity': '0.4' },
        '50%': { 'opacity': '0.5' },
        '60%': { 'opacity': '0.6' },
        '70%': { 'opacity': '0.7' },
        '80%': { 'opacity': '0.8' },
        '90%': { 'opacity': '0.9' },
        '100%': { 'opacity': '1' }
      },
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
    },
    animation: {
      pulse: 'pulse 1.5s ease-in-out',
      fadeIn: 'fadeIn 1s ease-in-out',
      spinSlow: 'spin 2s linear infinite',
    },
  },
};
export const plugins = [];

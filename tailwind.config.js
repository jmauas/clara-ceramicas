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
      fadeIn: {
        '0%': { opacity: 0 },
        '100%': { opacity: 1 },
      },
    },
    animation: {
      pulse: 'pulse 1.0s infinite',
      fadeIn: 'fadeIn 1s ease-in-out',
      spinSlow: 'spin 2s linear infinite',
    },
  },
};
export const plugins = [];

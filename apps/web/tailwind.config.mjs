/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/lib/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'body': '#f7f3ee',
        'card': '#ffffff',
        'accent-primary': '#4F7C63',
        'accent-primary-soft': '#e2f0e8',
        'accent-secondary': '#F4A87A',
        'ink': '#1E2220',
        'lane-bg': '#E7E0D9',
        'text-main': '#121212',
        'text-muted': '#4b5563',
      },
    },
  },
  plugins: [],
};


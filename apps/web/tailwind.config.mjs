/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'body': '#f7f3ee',
        'card': '#ffffff',
        'accent-primary': '#3b7f5c',
        'accent-primary-soft': '#e2f0e8',
        'text-main': '#121212',
        'text-muted': '#4b5563',
      },
    },
  },
  plugins: [],
};


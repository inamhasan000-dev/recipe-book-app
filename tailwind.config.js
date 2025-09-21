/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx}",       // Next.js default pages directory
    "./components/**/*.{js,ts,jsx,tsx}",   // Components folder
    "./app/**/*.{js,ts,jsx,tsx}",          // App directory (Next.js 13+)
    "./src/**/*.{js,ts,jsx,tsx}",          // Optional: if you're using src/
  ],
  theme: {
    extend: {},
  },
  plugins: [],
};

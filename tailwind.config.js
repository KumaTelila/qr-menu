/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['var(--font-inter)', 'system-ui', 'sans-serif'],
        display: ['Georgia', 'serif'],
      },
      colors: {
        brand: {
          dark: '#1a1a1a',
          gold: '#f5e6c8',
          muted: '#a09070',
        },
      },
    },
  },
  plugins: [],
}

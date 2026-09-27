/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        noir: {
          950: '#090807',
          900: '#11100e',
          850: '#171613',
          800: '#211f1a',
          700: '#2e2a24',
          600: '#443f36',
          500: '#615a4e',
          400: '#8a8170',
          300: '#b8af9c',
        },
        gold: {
          300: '#e5cd93',
          400: '#d5b773',
          500: '#c5a059',
          600: '#a3813e',
          700: '#81632a',
        },
        paper: {
          50: '#faf7f0',
          100: '#f4ede0',
          200: '#e7dcce',
          300: '#d6c8b3',
          400: '#b09f86',
        },
        blood: {
          700: '#851b1b',
          800: '#691515',
          900: '#4e1010',
        }
      },
      fontFamily: {
        serif: ['"Playfair Display"', 'Georgia', 'Cambria', 'serif'],
        display: ['"Cinzel"', '"Playfair Display"', 'serif'],
        sans: ['"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'gold-glow': '0 0 15px rgba(197, 160, 89, 0.25)',
        'gold-subtle': '0 2px 8px rgba(197, 160, 89, 0.12)',
        'inner-dark': 'inset 0 2px 4px 0 rgba(0, 0, 0, 0.6)',
      },
      backgroundImage: {
        'gradient-radial': 'radial-gradient(var(--tw-gradient-stops))',
      }
    },
  },
  plugins: [],
}

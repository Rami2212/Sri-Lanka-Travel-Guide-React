/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      fontFamily: {
        display: ['Outfit', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        body: ['Manrope', 'ui-sans-serif', 'system-ui', 'sans-serif'],
      },
      colors: {
        lagoon: {
          50: '#ecfeff',
          100: '#cffafe',
          500: '#0891b2',
          700: '#0e7490',
          900: '#164e63',
        },
        cinnamon: {
          50: '#fff7ed',
          100: '#ffedd5',
          400: '#fb923c',
          500: '#f97316',
          700: '#c2410c',
        },
        palm: {
          50: '#f0fdf4',
          100: '#dcfce7',
          500: '#22c55e',
          700: '#15803d',
          900: '#14532d',
        },
      },
      boxShadow: {
        soft: '0 20px 60px rgba(15, 118, 110, 0.16)',
        card: '0 12px 35px rgba(15, 23, 42, 0.10)',
      },
    },
  },
  plugins: [],
};

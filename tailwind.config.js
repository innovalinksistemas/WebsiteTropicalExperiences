export default {
  content: ['./index.html', './src/**/*.{vue,js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        ink: '#0b1f1a',
        moss: {
          100: '#dfe9e2',
          300: '#9fb7ab',
          500: '#436b5d',
          700: '#214236',
          900: '#112a24',
        },
        sun: {
          400: '#f0b44c',
          500: '#ff8f4d',
        },
      },
      fontFamily: {
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
      },
      boxShadow: {
        glow: '0 20px 40px rgba(240, 180, 76, 0.25)',
        soft: '0 16px 32px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}

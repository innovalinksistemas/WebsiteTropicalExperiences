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
          700: '#253d2f',   // ← verde de marca exacto (antes #214236)
          900: '#112a24',
        },
        sun: {
          400: '#e8c28b',   // ← crema de marca (antes #f0b44c, muy amarillo)
          500: '#e8442e',   // ← naranja-rojo de marca (antes #ff8f4d, salmón)
        },
        cream: '#eeebe4',   // ← blanco cálido de marca — nuevo token
      },
      fontFamily: {
        // NOTA: 'Space Grotesk' es una fuente genérica de IA — considerar
        // cambiarla por algo más distintivo para una marca de lujo.
        // Opciones recomendadas: 'Cormorant Garamond', 'Libre Baskerville',
        // 'DM Serif Display' para sans, o mantener si ya es parte del branding.
        sans: ['"Space Grotesk"', 'sans-serif'],
        display: ['"Fraunces"', 'serif'],
      },
      boxShadow: {
        // ← Glow actualizado al naranja-rojo real de la marca
        glow: '0 20px 40px rgba(232, 68, 46, 0.30)',
        // ← Glow crema para elementos secundarios (badges, bordes)
        'glow-cream': '0 8px 32px rgba(232, 194, 139, 0.20)',
        soft: '0 16px 32px rgba(0, 0, 0, 0.25)',
      },
    },
  },
  plugins: [],
}
/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        felt: { DEFAULT: '#1f3a2e', deep: '#172e23', groove: '#142a1f', line: '#2c4a3c' },
        chalk: { DEFAULT: '#f2efe6', dim: '#b8c6b9', faint: '#88a091' },
        paper: { DEFAULT: '#f5f2ea', warm: '#ece7da', edge: '#d9d2bf' },
        ink: { DEFAULT: '#1b1b18', soft: '#4b4a43', faint: '#6f6c61' },
        stamp: { DEFAULT: '#b83a24', deep: '#9a2f1c', tint: '#f3dcd5' },
        wood: { DEFAULT: '#7b5b3b', light: '#9a7650' },
      },
      fontFamily: {
        board: ['Archivo', 'Arial Narrow', 'sans-serif'],
        sans: ['"Public Sans"', 'system-ui', 'sans-serif'],
      },
      maxWidth: { page: '76rem' },
    },
  },
  plugins: [],
};

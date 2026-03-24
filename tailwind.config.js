/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      colors: {
        oviedo: {
          blue:    '#003F8A',
          blueDark: '#002A5E',
          blueLight: '#0057B7',
          white:   '#F5F5F0',
          gold:    '#C8A84B',
          goldDark: '#9E7C2A',
          ink:     '#0D0D1A',
          gray:    '#6B7280',
          lightGray: '#E8E8E2',
        },
      },
      fontFamily: {
        headline: ['var(--font-playfair)', 'Georgia', 'serif'],
        body:     ['var(--font-source-serif)', 'Georgia', 'serif'],
        sans:     ['var(--font-barlow)', 'system-ui', 'sans-serif'],
      },
      backgroundImage: {
        'noise': "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.04'/%3E%3C/svg%3E\")",
      },
    },
  },
  plugins: [],
};

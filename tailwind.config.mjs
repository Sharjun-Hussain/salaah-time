/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      animation: {
        // We define a new animation called 'marquee'
        marquee: 'marquee 40s linear infinite',
      },
      keyframes: {
        // And its corresponding keyframes
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' }, // Moves left by half its width (the width of one content block)
        },
      },
    },
  },
  plugins: [],
}
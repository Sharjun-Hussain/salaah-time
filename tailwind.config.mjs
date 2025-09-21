/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        'primary-blue': '#4A90E2', // A vibrant blue
        'secondary-green': '#50E3C2', // A bright teal-green
        'dark-background': '#1A202C', // Dark blue-gray for main background
        'card-bg': 'rgba(255, 255, 255, 0.08)', // Translucent card background
        'active-card': 'rgba(255, 255, 255, 0.15)', // More opaque for active
        'text-light': '#E0E0E0', // Lighter text for contrast
        'text-primary': '#FFFFFF', // White text
        'accent-gold': '#FFD700', // Gold accent for special elements
      },
      animation: {
        marquee: 'marquee 40s linear infinite',
        'fade-in': 'fadeIn 1s ease-out forwards',
        'pulse-light': 'pulseLight 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'subtle-pulse': 'subtlePulse 2.5s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      },
      keyframes: {
        marquee: {
          '0%': { transform: 'translateX(0%)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        fadeIn: {
          '0%': { opacity: '0', transform: 'translateY(10px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        pulseLight: {
          '0%, 100%': { opacity: '1' },
          '50%': { opacity: '0.7' },
        },
        subtlePulse: {
          '0%, 100%': { opacity: 1 },
          '50%': { opacity: 0.3 },
        },
      },
    },
  },
  plugins: [],
}
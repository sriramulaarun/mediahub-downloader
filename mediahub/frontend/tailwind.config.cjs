/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#4F46E5', // Indigo 600
          dark: '#4338CA',
          light: '#6366F1'
        },
        secondary: {
          DEFAULT: '#7C3AED', // Violet 600
          dark: '#6D28D9',
          light: '#8B5CF6'
        },
        darkbg: '#0F172A',     // Slate 900
        cardbg: '#1E293B',     // Slate 800
        success: '#10B981',    // Emerald 500
        error: '#EF4444',      // Red 500
        textwhite: '#FFFFFF',  // White
        borderglass: 'rgba(255, 255, 255, 0.1)'
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      backgroundImage: {
        'glass-gradient': 'linear-gradient(135deg, rgba(255, 255, 255, 0.05) 0%, rgba(255, 255, 255, 0.01) 100%)',
        'brand-gradient': 'linear-gradient(135deg, #4F46E5 0%, #7C3AED 100%)',
        'glow-gradient': 'radial-gradient(circle at center, rgba(124, 58, 237, 0.15) 0%, rgba(15, 23, 42, 0) 70%)'
      },
      boxShadow: {
        'glass': '0 8px 32px 0 rgba(0, 0, 0, 0.37)',
        'glass-inset': 'inset 0 1px 1px 0 rgba(255, 255, 255, 0.1)'
      }
    },
  },
  plugins: [],
}

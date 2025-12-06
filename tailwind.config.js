/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/app/**/*.{js,ts,jsx,tsx}",
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // The SportY Red (Used sparingly for impact)
        brand: {
          DEFAULT: '#E62E2E', // Slightly deeper red for elegance
          glow: '#FF4D4D',    // Brighter for lighting effects
        },
        // The "Stealth" Palette
        dark: {
          bg: '#050505',      // Almost pure black, better for OLED
          surface: '#0F0F11', // Slightly lighter for cards
          border: '#1E1E22',  // Very subtle borders
          text: '#EDEDED',    // High readability off-white
          muted: '#A1A1AA',   // Secondary text
        },
      },
      borderRadius: {
        'xl': '1rem',
        '2xl': '1.5rem',
      },
      backgroundImage: {
        'ambient-gradient': 'radial-gradient(circle at center, rgba(230, 46, 46, 0.15) 0%, rgba(5, 5, 5, 0) 70%)',
      },
      boxShadow: {
        'glow': '0 0 40px -10px rgba(230, 46, 46, 0.1)',
        'glass': '0 4px 30px rgba(0, 0, 0, 0.1)',
      },
    },
  },
  plugins: [],
};
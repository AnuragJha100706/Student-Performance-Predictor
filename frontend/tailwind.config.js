/** @type {import('tailwindcss').Config} */
module.exports = {
  darkMode: 'class',
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#8B5CF6', // Vibrant Purple
          dark: '#7C3AED',
          light: '#A78BFA',
        },
        secondary: {
          DEFAULT: '#F59E0B', // Warm Amber
          dark: '#D97706',
          light: '#FBBF24',
        },
        success: {
          DEFAULT: '#10B981', // Mint Green
        },
        error: {
          DEFAULT: '#EF4444', // Soft Red
        },
        dark: {
          bg: '#0F172A',      // Main background
          card: '#1E293B',    // Card background
          text: {
            primary: '#F8FAFC',   // Text primary
            secondary: '#CBD5E1', // Text secondary
          },
          // Compatibility mappings
          DEFAULT: '#1E293B', 
          lighter: '#334155',
          darker: '#0F172A',
        },
        light: {
          DEFAULT: '#f3f4f6', // Gray 100
          lighter: '#f9fafb', // Gray 50
          darker: '#e5e7eb',  // Gray 200
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      animation: {
        'blob': 'blob 7s infinite',
      },
      keyframes: {
        blob: {
          '0%': { transform: 'translate(0px, 0px) scale(1)' },
          '33%': { transform: 'translate(30px, -50px) scale(1.1)' },
          '66%': { transform: 'translate(-20px, 20px) scale(0.9)' },
          '100%': { transform: 'translate(0px, 0px) scale(1)' },
        }
      }
    },
  },
  plugins: [],
}

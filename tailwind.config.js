/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        background: '#FAF8F5',
        surface: '#FFFFFF',
        sage: {
          DEFAULT: '#C8D4C1',
          light: '#DCE4D7',
          dark: '#B0C0A8',
        },
        lavender: {
          DEFAULT: '#E2D5E5',
          light: '#EFE7F1',
          dark: '#CFBED3',
        },
        mauve: {
          DEFAULT: '#A783A2',
          light: '#B899B4',
          dark: '#8E6789',
          hover: '#936E8F',
        },
        'antique-gold': {
          DEFAULT: '#B49A6C',
          light: '#C8B28B',
          dark: '#9B8153',
        },
        ink: {
          DEFAULT: '#292624',
          light: '#3D3936',
        },
        secondary: '#77716F',
        divider: '#E7E0DA',
      },
      fontFamily: {
        playfair: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        cormorant: ['"Cormorant Garamond"', '"Playfair Display"', 'Georgia', 'serif'],
        editorial: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        serif: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        bodoni: ['"Playfair Display"', 'Georgia', 'serif'],
        prata: ['"Playfair Display"', 'Georgia', 'serif'],
        italiana: ['"Playfair Display"', 'Georgia', 'serif'],
        brand: ['"Playfair Display"', '"Cormorant Garamond"', 'Georgia', 'serif'],
        sans: ['"Plus Jakarta Sans"', '"Outfit"', '"Inter"', 'system-ui', '-apple-system', 'sans-serif'],
      },
      letterSpacing: {
        'ultra-wide': '0.22em',
        'super-wide': '0.18em',
      },
      boxShadow: {
        'subtle': '0 4px 20px -2px rgba(41, 38, 36, 0.05)',
        'card': '0 8px 30px -4px rgba(41, 38, 36, 0.07)',
        'modal': '0 20px 40px -10px rgba(41, 38, 36, 0.12)',
      },
      borderRadius: {
        'card': '8px',
      }
    },
  },
  plugins: [],
}

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        desert: {
          'tan': '#F2D5A9',       // Light tan background
          'orange': '#E07A42',     // Bright terracotta orange
          'terracotta': '#D36B33', // Medium terracotta
          'rust': '#A85326',       // Rust/brown color
          'olive': '#7E7242',      // Olive green
          'green': '#515C3F',      // Dark green
          'black': '#1A1A1A'       // Black for outlines
        }
      }
    },
  },
  safelist: [
    // Using patterns to capture all potential theme colors
    {
      pattern: /bg-(amber|stone|gray|brown|red|orange|yellow|green|blue|indigo|purple|pink|slate|zinc|neutral|white|desert)-(50|100|200|300|400|500|600|700|800|900|tan|orange|terracotta|rust|olive|green|black)/,
      variants: ['hover', 'focus', 'active', 'after', 'before']
    },
    {
      pattern: /text-(amber|stone|gray|brown|red|orange|yellow|green|blue|indigo|purple|pink|slate|zinc|neutral|white|desert)-(50|100|200|300|400|500|600|700|800|900|tan|orange|terracotta|rust|olive|green|black)/,
      variants: ['hover', 'focus', 'active', 'group-hover']
    },
    {
      pattern: /border-(amber|stone|gray|brown|red|orange|yellow|green|blue|indigo|purple|pink|slate|zinc|neutral|white|desert)-(50|100|200|300|400|500|600|700|800|900|tan|orange|terracotta|rust|olive|green|black)/,
      variants: ['hover', 'focus', 'active']
    },
    // Common utility classes that might be dynamically applied
    {
      pattern: /(opacity|shadow|rounded|transition|duration|ease|transform|scale|translate|rotate)-.+/
    },
    // Common layout classes
    'w-full', 'h-full', 'min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center',
    'font-serif', 'font-sans', 'font-bold', 'font-medium', 'font-normal',
    // Accessibility classes
    'sr-only', 'not-sr-only', 'focus:ring', 'focus:ring-offset-2', 'focus:outline-none'
  ],
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {},
  },
  safelist: [
    // Using patterns to capture all potential theme colors
    {
      pattern: /bg-(amber|stone|gray|brown|red|orange|yellow|green|blue|indigo|purple|pink|slate|zinc|neutral|white)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'active', 'after']
    },
    {
      pattern: /text-(amber|stone|gray|brown|red|orange|yellow|green|blue|indigo|purple|pink|slate|zinc|neutral|white)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus', 'active']
    },
    {
      pattern: /border-(amber|stone|gray|brown|red|orange|yellow|green|blue|indigo|purple|pink|slate|zinc|neutral|white)-(50|100|200|300|400|500|600|700|800|900)/,
      variants: ['hover', 'focus']
    },
    // Common utility classes that might be dynamically applied
    {
      pattern: /(opacity|shadow|rounded|transition|duration|ease|transform|scale|translate|rotate)-.+/
    },
    // Common layout classes
    'w-full', 'h-full', 'min-h-screen', 'flex', 'flex-col', 'items-center', 'justify-center',
    'font-serif', 'font-sans', 'font-bold', 'font-medium', 'font-normal'
  ],
  plugins: [],
}


/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,jsx}"
  ],
  theme: {
    extend: {
      colors: {
        studio: {
          50: '#faf8f3',
          100: '#f5f1e8',
          bg: '#faf8f3',
          text: '#1a1a1a',
          border: '#000'
        },
        accent: {
          philosophy: '#8b5a2b',
          ai: '#ff6b6b',
          creative: '#ff9f1c',
          engineering: '#0066cc',
          design: '#e91e63',
          film: '#6f42c1',
          systems: '#00897b'
        }
      },
      boxShadow: {
        hard: '4px 4px 0px rgba(0, 0, 0, 0.15)',
        'hard-lg': '6px 6px 0px rgba(0, 0, 0, 0.15)',
        'hard-hover': '2px 2px 0px rgba(0, 0, 0, 0.1)'
      },
      fontFamily: {
        display: ['system-ui', 'sans-serif'],
        body: ['system-ui', 'sans-serif']
      }
    }
  },
  plugins: []
}

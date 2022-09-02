/* eslint-disable global-require */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      fontFamily: {
        jetBrains: ['JetBrains Mono', 'monospace'],
      }
    },
  },
  plugins: [require('daisyui')],
};

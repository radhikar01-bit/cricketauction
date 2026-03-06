/** @type {import('tailwindcss').Config} */
module.exports = {
 content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
    theme: {
        extend: {
            animation: {
                'marquee': 'marquee 30s linear infinite',
                'infinite-scroll': 'infinite-scroll 10s linear infinite',
                'infinite-scroll-fast': 'infinite-scroll 5s linear infinite', // Faster for mobile
            },
            keyframes: {
                marquee: {
                    '0%': { transform: 'translateX(100%)' },
                    '100%': { transform: 'translateX(-100%)' },
                },
                'infinite-scroll': {
                    from: { transform: 'translateX(0)' },
                    to: { transform: 'translateX(-50%)' },
                }
            }
        }
    }
,
  plugins: [],
}


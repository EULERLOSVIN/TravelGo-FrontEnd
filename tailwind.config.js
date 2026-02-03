/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
        "./src/**/*.{html,ts}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                "primary": "#16a34a",
                "brand-red": "#EF4444",
                "brand-green": "#16a34a",
                "brand-trash": "#dc2626",
                "background-light": "#f8fafc",
            },
            fontFamily: {
                "sans": ["Inter", "sans-serif"]
            },
        },
    },
    plugins: [],
}

// tailwind.config.js
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      animation: {
        "logo-entrance":
          "logoEntrance 1.2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards",
      },
      keyframes: {
        logoEntrance: {
          "0%": {
            opacity: "0",
            transform: "scale(0.3) translateY(120px)", // small + below center
          },
          "60%": {
            opacity: "0.7",
            transform: "scale(1.15) translateY(-20px)", // overshoot a bit for bounce feel
          },
          "100%": {
            opacity: "1",
            transform: "scale(1) translateY(0)", // final position & size
          },
        },
      },
      // You can add custom colors, fonts, etc. here later
      fontFamily: {
        urbanist: ["var(--font-urbanist)", "sans-serif"],
        // Add Nunito when you need it
        nunito: ["var(--font-nunito)", "sans-serif"],
      },
      colors: {
        primary: "#0D80E1",
        // Add more custom colors from Figma if needed
      },
    },
  },
  plugins: [],
};

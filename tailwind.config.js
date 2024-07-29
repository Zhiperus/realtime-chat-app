/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        whitegreen: "#D6EFD8",
        graygreen: "#80AF81",
        green: "#508D4E",
        darkgreen: "#1A5319",
      },
    },
  },
  plugins: [],
};

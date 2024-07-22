/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    screens: {
      sm: { min: "390px", max: "819px" }, // 모바일 크기
    },
    extend: {
      colors: {
        primary: "#5DB075",
      },
    },
  },
  plugins: [],
};

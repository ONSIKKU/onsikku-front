/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require("nativewind/preset")],
  content: [
    "./App.{js,jsx,ts,tsx}",
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
    "./screens/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        "background-orange": "#FFF5E9",
      },
      fontFamily: {
        sans: ["Pretendard", "System"],
        bold: ["PretendardBold", "System"],
        light: ["PretendardLight", "System"],
      },
    },
  },
  plugins: [],
};

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
        "onsikku-dark-orange": "#FB923C",
        "light-orange": "#FEC598",
        "button-selected-light-orange": "#FFEDD0",
        "onsikku-main-orange": "#FFF5E9",
        "onsikku-light-gray": "#FAFBFB",
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

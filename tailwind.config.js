export const theme = {
  extend: {
    animation: {
      "modal-show": "modalOpen 0.3s ease-out",
    },
    keyframes: {
      modalOpen: {
        "0%": { opacity: 0, transform: "scale(0.8)" },
        "100%": { opacity: 1, transform: "scale(1)" },
      },
    },
  },
  content: ["./src/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      animation: {
        fadeIn: "fadeIn 0.4s ease-in forwards",
      },
      keyframes: {
        fadeIn: {
          from: { opacity: 0 },
          to: { opacity: 1 },
        },
      },
      colors: {
        cholimexRed: "#dd3333",
        cholimexDarkRed: "#b52828",
      },
    },
  },
  plugins: [],
};

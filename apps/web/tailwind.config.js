/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#306fcb",
        "primary-light": "#cadaf2",
      },
    },
  },
  plugins: [],
};

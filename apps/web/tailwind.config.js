/** @type {import("tailwindcss").Config} */
module.exports = {
  content: ["./src/**/*.tsx", "../../packages/ui/src/**/*.tsx"],
  theme: {
    extend: {
      colors: {
        primary: "#306fcb",
        "primary-light": "#cadaf2",
      },
      fontFamily: {
        sans: ["Roboto"],
        outfit: ["Outfit"],
        roboto: ["Roboto"],
      },
      zIndex: {
        auto: "auto",
        dropdown: 1000,
        sticky: 1020,
        header: 1025,
        fixed: 1030,
        modalBackdrop: 1040,
        modal: 1050,
        popover: 1060,
        tooltip: 1070,
        0: "0",
        10: "10",
        20: "20",
        30: "30",
        40: "40",
        50: "50",
      },
    },
  },
  plugins: [require("@tailwindcss/line-clamp")],
};

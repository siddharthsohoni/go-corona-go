export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "ui-sans-serif", "system-ui"],
      },
      fontSize: {
        base: "1.125rem", // Default font size increased to 18px
        lg: "1.25rem", // Large font size increased to 20px
        xl: "1.5rem", // Extra-large font size increased to 24px
        "2xl": "1.875rem", // 2XL font size increased to 30px
        "3xl": "2.25rem", // 3XL font size increased to 36px
      },
    },
  },
  plugins: [],
};

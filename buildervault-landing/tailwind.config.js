/** @type {import("tailwindcss").Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        display: ["Space Grotesk", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },
      colors: {
        background: "#0A0F1E",
        foreground: "#FFFFFF",
        mint: "#6EE7B7",
        cyan: "#22D3EE",
        "accent-purple": "#7C3AED",
        "accent-blue": "#2563EB",
        "accent-coral": "#FF6B6B",
        "accent-yellow": "#FDE68A",
      },
    },
  },
  plugins: [],
}

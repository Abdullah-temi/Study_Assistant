import type { Config } from "tailwindcss";

export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        ink: "#18212f",
        mist: "#edf3f8",
        ocean: "#2563eb",
        mint: "#14b8a6",
        coral: "#f9735b",
        saffron: "#f7b731",
      },
      boxShadow: {
        soft: "0 18px 50px rgba(24, 33, 47, 0.10)",
      },
    },
  },
  plugins: [],
} satisfies Config;


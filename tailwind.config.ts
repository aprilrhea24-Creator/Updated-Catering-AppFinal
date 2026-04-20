import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        ink: "#1b140f",
        oat: "#f7f1e6",
        ember: "#a3482f",
        olive: "#40523b",
        cream: "#fffaf2",
        gold: "#d7a95b"
      },
      fontFamily: {
        display: ["Georgia", "serif"],
        body: ["ui-sans-serif", "system-ui", "sans-serif"]
      },
      boxShadow: {
        soft: "0 20px 60px rgba(27, 20, 15, 0.12)"
      },
      backgroundImage: {
        "chef-glow":
          "radial-gradient(circle at top left, rgba(215,169,91,0.25), transparent 35%), radial-gradient(circle at bottom right, rgba(163,72,47,0.18), transparent 30%)"
      }
    }
  },
  plugins: []
};

export default config;

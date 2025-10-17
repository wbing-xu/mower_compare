import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
    "./content/**/*.{mdx,md}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#ecf6f1",
          100: "#cde5d7",
          200: "#abd3bb",
          300: "#87c19f",
          400: "#65b086",
          500: "#46986d",
          600: "#357555",
          700: "#24543d",
          800: "#133225",
          900: "#07190f"
        }
      },
      fontFamily: {
        sans: ["'Source Han Sans SC'", "'Inter'", "system-ui", "sans-serif"]
      },
      boxShadow: {
        card: "0 8px 24px rgba(0,0,0,0.08)"
      }
    }
  },
  plugins: []
};

export default config;

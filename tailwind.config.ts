import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        "leaf-green": "#09b44d"
      },
      fontFamily: {
        sans: ['Arial', 'Helvetica', 'sans-serif'], // You can add more fallback fonts
      },
    },
  },
  plugins: [],
};
export default config;

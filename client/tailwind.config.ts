import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";

export default {
  content: ["./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-sans)", ...fontFamily.sans],
      },
      colors: {
        background: {
          primary: "var(--background-primary)",
          secondary: "var(--background-secondary)",
        },
        foreground: "var(--foreground)",
        font: "var(--font)",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        accent: {
          1: "var(--accent-1)",
          2: "var(--accent-2)",
        },
      },
    },
  },
  plugins: [],
} satisfies Config;

import type { Config } from "tailwindcss";
import tailwindAnimate from "tailwindcss-animate";
import typography from "@tailwindcss/typography";
import type { PluginAPI } from "tailwindcss/types/config";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./sanity/**/*.{js,ts,jsx,tsx,mdx}",
  ],

  theme: {
    extend: {
      screens: {
        xs: "475px",
      },
      fontFamily: {
        "work-sans": ["var(--font-work-sans)"],
      },
      colors: {
        brand: {
          "25": "#F7FAF5",
          "50": "#ECF4E7",
          "100": "#D6E8CC",
          "200": "#BDDDB1",
          "300": "#A5D196",
          "400": "#8EC57B",
          "500": "#77B860",
          "600": "#5E994B",
          "700": "#4A7A3B",
          "800": "#355A2B",
          "900": "#233C1B",
          "950": "#162814",
        },
        cream: {
          "50": "#fffefa",
          "100": "#fffaef",
          "200": "#fff8e8",
          "300": "#ded8ca",
          "400": "#9e9a90",
          "500": "#807c74",
          "600": "#636059",
          "700": "#484540",
          "800": "#161513",
          "900": "#030303",
        },
        accent: {
          "50": "#ffea92",
          "100": "#ffe264",
          "200": "#ffd900",
          "300": "#debc00",
          "400": "#bea100",
          "500": "#9e8600",
          "600": "#806c00",
          "700": "#635300",
          "800": "#483b00",
          "900": "#161100",
        },
        background: "#ffffff", // Cream 200
        foreground: "#2e2c29", // Cream 800
        card: {
          DEFAULT: "#ffffff", // Cream 50
          foreground: "#2e2c29", // Cream 700
        },
        popover: {
          DEFAULT: "#ffffff", // Cream 50
          foreground: "#636059", // Cream 600
        },
        primary: {
          DEFAULT: "#5E994B", // Brand 600
          foreground: "#fffefa", // Cream 800
        },
        secondary: {
          DEFAULT: "#ffd900", // Cream 300
          foreground: "#807c74", // Cream 500
        },
        muted: {
          DEFAULT: "#ded8ca", // Cream 300
          foreground: "#636059", // Cream 600
        },
        destructive: {
          DEFAULT: "#E50000", // RED
          foreground: "#161100", // Accent 900
        },
        border: "#161513", // Cream 800
        input: "#161513", // Cream 800
        ring: "#161513", // Cream 800
        chart: {
          "1": "#6A994E",
          "2": "#A7C957",
          "3": "#FFBC42",
          "4": "#F28D35",
          "5": "#D96C2B",
        },
        sidebar: {
          DEFAULT: "#fffdf8", // Cream 50
          foreground: "#2e2c29", // Cream 800
          primary: "#ffd900", // Accent 200
          "primary-foreground": "#2e2c29", // Cream 800
          accent: "#ffe264", // Accent 100
          "accent-foreground": "#2e2c29", // Cream 800
          border: "#DED8CA", // Cream 300
          ring: "#ffd900", // Accent 200
        },
      },
      borderRadius: {
        DEFAULT: "0.5rem",
        lg: "0.5rem",
        md: "calc(0.5rem - 2px)",
        sm: "calc(0.5rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
        shimmer: {
          "0%": {
            transform: "translateX(-100%)",
          },
          "100%": {
            transform: "translateX(100%)",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        shimmer: "shimmer 2s infinite",
      },
    },
  },
  plugins: [
    tailwindAnimate,
    typography,
    function ({ addBase, theme }: PluginAPI) {
      addBase({
        body: {
          backgroundColor: theme("colors.background.DEFAULT", "#ffffff"),
          color: theme("colors.foreground.DEFAULT", "#000000"),
        },
        "*": {
          borderColor: theme("colors.border.DEFAULT", "#e5e5e5"),
        },
      });
    },
  ],
};
export default config;

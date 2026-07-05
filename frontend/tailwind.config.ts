import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // shadcn/ui semantic colors
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        // Shreeji Art brand palette
        brand: {
          gold:        "#D4A017",
          "gold-light":"#F0C040",
          "gold-dark": "#A07810",
          "gold-muted":"rgb(212 160 23 / 0.12)",
          navy:        "#1A1A2E",
          "navy-light":"#2A2A4E",
          red:         "#E94560",
        },
        // Design-system surface / text / border tokens
        sa: {
          bg:           "rgb(var(--sa-bg) / <alpha-value>)",
          surface:      "rgb(var(--sa-surface) / <alpha-value>)",
          "surface-2":  "rgb(var(--sa-surface-2) / <alpha-value>)",
          raised:       "rgb(var(--sa-surface-raised) / <alpha-value>)",
          border:       "rgb(var(--sa-border) / <alpha-value>)",
          "border-strong": "rgb(var(--sa-border-strong) / <alpha-value>)",
          text:         "rgb(var(--sa-text) / <alpha-value>)",
          muted:        "rgb(var(--sa-muted) / <alpha-value>)",
          faint:        "rgb(var(--sa-faint) / <alpha-value>)",
          disabled:     "rgb(var(--sa-disabled) / <alpha-value>)",
          // Status
          success:      "rgb(var(--sa-success) / <alpha-value>)",
          "success-bg": "rgb(var(--sa-success-bg) / <alpha-value>)",
          "success-border": "rgb(var(--sa-success-border) / <alpha-value>)",
          warning:      "rgb(var(--sa-warning) / <alpha-value>)",
          "warning-bg": "rgb(var(--sa-warning-bg) / <alpha-value>)",
          "warning-border": "rgb(var(--sa-warning-border) / <alpha-value>)",
          error:        "rgb(var(--sa-error) / <alpha-value>)",
          "error-bg":   "rgb(var(--sa-error-bg) / <alpha-value>)",
          "error-border": "rgb(var(--sa-error-border) / <alpha-value>)",
          info:         "rgb(var(--sa-info) / <alpha-value>)",
          "info-bg":    "rgb(var(--sa-info-bg) / <alpha-value>)",
          "info-border": "rgb(var(--sa-info-border) / <alpha-value>)",
        },
      },
      fontFamily: {
        sans:    ["Inter", "system-ui", "sans-serif"],
        display: ["Playfair Display", "Georgia", "serif"],
        mono:    ["JetBrains Mono", "Menlo", "Monaco", "Consolas", "monospace"],
      },
      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
      },
      borderRadius: {
        sm:   "calc(var(--radius) - 4px)",
        md:   "calc(var(--radius) - 2px)",
        lg:   "var(--radius)",
        xl:   "calc(var(--radius) + 4px)",
        "2xl":"calc(var(--radius) + 8px)",
        "3xl":"1.25rem",
      },
      boxShadow: {
        "sa-xs":  "0 1px 2px 0 rgb(0 0 0 / 0.04)",
        "sa-sm":  "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
        "sa-md":  "0 4px 6px -1px rgb(0 0 0 / 0.07), 0 2px 4px -2px rgb(0 0 0 / 0.05)",
        "sa-lg":  "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.05)",
        "sa-xl":  "0 20px 25px -5px rgb(0 0 0 / 0.08), 0 8px 10px -6px rgb(0 0 0 / 0.04)",
        "sa-gold":"0 0 0 3px rgb(212 160 23 / 0.15)",
        "sa-inset":"inset 0 1px 2px 0 rgb(0 0 0 / 0.06)",
        "sa-focus":"0 0 0 2px #fff, 0 0 0 4px rgb(212 160 23 / 0.5)",
      },
      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "quick":  "cubic-bezier(0.4, 0, 0.2, 1)",
      },
      keyframes: {
        "fade-in": {
          from: { opacity: "0" },
          to:   { opacity: "1" },
        },
        "fade-out": {
          from: { opacity: "1" },
          to:   { opacity: "0" },
        },
        "slide-up": {
          from: { transform: "translateY(10px)", opacity: "0" },
          to:   { transform: "translateY(0)",    opacity: "1" },
        },
        "slide-down": {
          from: { transform: "translateY(-10px)", opacity: "0" },
          to:   { transform: "translateY(0)",     opacity: "1" },
        },
        "slide-right": {
          from: { transform: "translateX(-10px)", opacity: "0" },
          to:   { transform: "translateX(0)",     opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to:   { transform: "scale(1)",    opacity: "1" },
        },
        "scale-out": {
          from: { transform: "scale(1)",    opacity: "1" },
          to:   { transform: "scale(0.95)", opacity: "0" },
        },
        "spin-slow": {
          from: { transform: "rotate(0deg)" },
          to:   { transform: "rotate(360deg)" },
        },
        "pulse-subtle": {
          "0%, 100%": { opacity: "1" },
          "50%":       { opacity: "0.6" },
        },
        "bounce-sm": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":       { transform: "translateY(-4px)" },
        },
        "shimmer": {
          "0%":   { backgroundPosition: "200% 0" },
          "100%": { backgroundPosition: "-200% 0" },
        },
      },
      animation: {
        "fade-in":      "fade-in 180ms ease-out",
        "fade-out":     "fade-out 120ms ease-in",
        "slide-up":     "slide-up 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-down":   "slide-down 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "slide-right":  "slide-right 220ms cubic-bezier(0.25, 0.46, 0.45, 0.94)",
        "scale-in":     "scale-in 200ms cubic-bezier(0.34, 1.56, 0.64, 1)",
        "scale-out":    "scale-out 150ms ease-in",
        "spin-slow":    "spin-slow 2s linear infinite",
        "pulse-subtle": "pulse-subtle 2s ease-in-out infinite",
        "shimmer":      "shimmer 1.6s ease-in-out infinite",
      },
      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
      },
    },
  },
  plugins: [],
};

export default config;

import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./styles/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: "var(--bg)",
        surface: "var(--surface)",
        border: "var(--border)",
        accent: "var(--accent)",
        accent2: "var(--accent2)",
        accent3: "var(--accent3)",
        "text-primary": "var(--text-primary)",
        "text-muted": "var(--text-muted)",
      },
      fontFamily: {
        syne: ["var(--font-syne)", "sans-serif"],
        mono: ["var(--font-dm-mono)", "monospace"],
      },
      animation: {
        'scroll': 'scroll 30s linear infinite',
        'scroll-reverse': 'scroll 30s linear infinite reverse',
        'pulse-glow': 'pulseGlow 2s infinite',
        'glitch': 'glitch 4s linear infinite',
      },
      keyframes: {
        scroll: {
          '0%': { transform: 'translateX(0)' },
          '100%': { transform: 'translateX(-50%)' },
        },
        pulseGlow: {
          '0%, 100%': { opacity: '1', boxShadow: '0 0 10px var(--accent)' },
          '50%': { opacity: '.5', boxShadow: '0 0 2px var(--accent)' },
        },
        glitch: {
          '0%, 92%, 100%': { transform: 'translate(0)' },
          '93%': { transform: 'translate(-2px, 2px)' },
          '94%': { transform: 'translate(-2px, -2px)' },
          '95%': { transform: 'translate(2px, 2px)' },
          '96%': { transform: 'translate(2px, -2px)' },
          '97%': { transform: 'translate(-2px, 0)' },
          '98%': { transform: 'translate(2px, 2px)' },
          '99%': { transform: 'translate(-2px, -2px)' },
        }
      }
    },
  },
  plugins: [],
};
export default config;

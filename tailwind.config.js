/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        background: "#050505",
        surface: "#0f0f0f",
        "surface-2": "#1a1a1a",
        "surface-3": "#242424",
        border: "#2a2a2a",
        "border-bright": "#3a3a3a",
        purple: {
          DEFAULT: "#a855f7",
          bright: "#c084fc",
          dim: "#7c3aed",
          glow: "rgba(168,85,247,0.3)",
        },
        cyan: {
          DEFAULT: "#22d3ee",
          bright: "#67e8f9",
          glow: "rgba(34,211,238,0.3)",
        },
        green: {
          neon: "#4ade80",
          glow: "rgba(74,222,128,0.3)",
        },
        text: {
          primary: "#f0f0f0",
          secondary: "#888",
          muted: "#555",
        },
      },
      fontFamily: {
        display: ["'Space Mono'", "monospace"],
        body: ["'DM Sans'", "sans-serif"],
      },
      boxShadow: {
        "glow-purple": "0 0 20px rgba(168,85,247,0.4), 0 0 40px rgba(168,85,247,0.1)",
        "glow-cyan": "0 0 20px rgba(34,211,238,0.4), 0 0 40px rgba(34,211,238,0.1)",
        "glow-green": "0 0 20px rgba(74,222,128,0.4)",
        glass: "inset 0 1px 0 rgba(255,255,255,0.05), 0 4px 24px rgba(0,0,0,0.5)",
      },
      backdropBlur: { xs: "2px" },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "float": "float 6s ease-in-out infinite",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "slide-up": "slideUp 0.4s ease-out",
        "slide-in": "slideIn 0.3s ease-out",
        "count-up": "countUp 0.5s ease-out",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-8px)" },
        },
        glowPulse: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.6" },
        },
        slideUp: {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        slideIn: {
          from: { transform: "translateX(-10px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        countUp: {
          from: { transform: "scale(0.8)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
    },
  },
  plugins: [],
};

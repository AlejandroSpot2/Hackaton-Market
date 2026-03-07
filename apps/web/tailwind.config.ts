import type { Config } from "tailwindcss";

const config: Config = {
    content: [
        "./app/**/*.{ts,tsx}",
        "./components/**/*.{ts,tsx}",
        "./lib/**/*.{ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                bg: "#050c18",
                panel: "#070f1c",
                amber: { DEFAULT: "#f59e0b", dim: "rgba(245,158,11,0.15)" },
                sky: { DEFAULT: "#38bdf8", dim: "rgba(56,189,248,0.12)" },
                emerald: { DEFAULT: "#22c55e", dim: "rgba(34,197,94,0.12)" },
                violet: { DEFAULT: "#a78bfa", dim: "rgba(167,139,250,0.12)" },
                rose: { DEFAULT: "#f87171", dim: "rgba(248,113,113,0.12)" },
                muted: "#7e90b8",
                border: "rgba(99,120,170,0.18)",
            },
            fontFamily: {
                sans: ["Inter", "Segoe UI", "sans-serif"],
                mono: ["JetBrains Mono", "Consolas", "monospace"],
            },
            keyframes: {
                "pulse-ring": {
                    "0%": { boxShadow: "0 0 0 0 rgba(56,189,248,0.4)" },
                    "70%": { boxShadow: "0 0 0 12px rgba(56,189,248,0)" },
                    "100%": { boxShadow: "0 0 0 0 rgba(56,189,248,0)" },
                },
                "flow-dash": { to: { strokeDashoffset: "-24" } },
                "fade-up": {
                    from: { opacity: "0", transform: "translateY(12px)" },
                    to: { opacity: "1", transform: "translateY(0)" },
                },
                "node-appear": {
                    from: { opacity: "0", transform: "scale(0.85)", filter: "blur(6px)" },
                    to: { opacity: "1", transform: "scale(1)", filter: "blur(0)" },
                },
                orbit: {
                    from: { transform: "rotate(0deg) translateX(44px) rotate(0deg)" },
                    to: { transform: "rotate(360deg) translateX(44px) rotate(-360deg)" },
                },
                orbit2: {
                    from: { transform: "rotate(120deg) translateX(44px) rotate(-120deg)" },
                    to: { transform: "rotate(480deg) translateX(44px) rotate(-480deg)" },
                },
                orbit3: {
                    from: { transform: "rotate(240deg) translateX(44px) rotate(-240deg)" },
                    to: { transform: "rotate(600deg) translateX(44px) rotate(-600deg)" },
                },
                "spin-slow": { to: { transform: "rotate(360deg)" } },
                "typing-cursor": {
                    "0%, 100%": { opacity: "1" },
                    "50%": { opacity: "0" },
                },
                shimmer: {
                    "0%": { backgroundPosition: "-200% 0" },
                    "100%": { backgroundPosition: "200% 0" },
                },
                "glow-pulse": {
                    "0%, 100%": { opacity: "0.6" },
                    "50%": { opacity: "1" },
                },
                "slide-in": {
                    from: { opacity: "0", transform: "translateX(16px)" },
                    to: { opacity: "1", transform: "translateX(0)" },
                },
            },
            animation: {
                "pulse-ring": "pulse-ring 1.5s ease infinite",
                "flow-dash": "flow-dash 0.5s linear infinite",
                "fade-up": "fade-up 0.3s ease both",
                "node-appear": "node-appear 0.4s ease both",
                orbit: "orbit 2.4s linear infinite",
                orbit2: "orbit2 2.4s linear infinite",
                orbit3: "orbit3 2.4s linear infinite",
                "spin-slow": "spin-slow 8s linear infinite",
                "typing-cursor": "typing-cursor 1s step-end infinite",
                shimmer: "shimmer 1.5s linear infinite",
                "glow-pulse": "glow-pulse 1.5s ease-in-out infinite",
                "slide-in": "slide-in 0.25s ease both",
            },
        },
    },
    plugins: [],
};
export default config;

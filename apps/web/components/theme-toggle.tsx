"use client";

import { useTheme } from "@/lib/theme";

export function ThemeToggle() {
  const { theme, toggle } = useTheme();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggle}
      title={`Switch to ${isDark ? "light" : "dark"} mode`}
      style={{
        position: "fixed",
        top: 16,
        right: 16,
        zIndex: 9999,
        width: 42,
        height: 42,
        borderRadius: "50%",
        border: `1px solid ${isDark ? "rgba(99,120,170,0.3)" : "rgba(99,3,48,0.2)"}`,
        background: isDark ? "rgba(7,15,28,0.88)" : "rgba(255,255,255,0.88)",
        backdropFilter: "blur(16px)",
        cursor: "pointer",
        fontSize: 18,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "0 4px 20px rgba(0,0,0,0.2)",
        transition: "all 0.22s",
      }}
      onMouseEnter={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1.08)"; }}
      onMouseLeave={(e) => { (e.currentTarget as HTMLButtonElement).style.transform = "scale(1)"; }}
    >
      {isDark ? "☀️" : "🌙"}
    </button>
  );
}

"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    const saved = localStorage.getItem("imbs-dark-mode");
    const enabled = saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
  }, []);
  return (
    <button
      className="btn-outline !py-[8px] !px-[13px] text-[14px]"
      aria-pressed={dark}
      onClick={() => {
        const el = document.documentElement;
        el.classList.toggle("dark");
        const enabled = el.classList.contains("dark");
        localStorage.setItem("imbs-dark-mode", enabled ? "dark" : "light");
        setDark(enabled);
      }}
      aria-label="Toggle dark mode"
    >
      {dark ? "☀️ Terang" : "🌙 Gelap"}
    </button>
  );
}

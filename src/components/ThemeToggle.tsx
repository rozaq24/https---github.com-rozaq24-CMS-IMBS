"use client";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);
  return (
    <button
      className="btn-outline !py-[8px] !px-[13px] text-[14px]"
      onClick={() => {
        const el = document.documentElement;
        el.classList.toggle("dark");
        setDark(el.classList.contains("dark"));
      }}
      aria-label="Toggle dark mode"
    >
      {dark ? "☀️ Terang" : "🌙 Gelap"}
    </button>
  );
}

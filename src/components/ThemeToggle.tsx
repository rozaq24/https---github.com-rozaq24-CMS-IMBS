"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { HardwareButton } from "@/components/echo/hardware-button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("imbs-dark-mode");
    const enabled = saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
  }, []);

  return (
    <HardwareButton
      variant="neutral"
      size="sm"
      icon={dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}
      aria-pressed={dark}
      aria-label={dark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      onClick={() => {
        const root = document.documentElement;
        root.classList.toggle("dark");
        const enabled = root.classList.contains("dark");
        localStorage.setItem("imbs-dark-mode", enabled ? "dark" : "light");
        setDark(enabled);
      }}
    >
      <span className="hidden sm:inline">{dark ? "Terang" : "Gelap"}</span>
    </HardwareButton>
  );
}

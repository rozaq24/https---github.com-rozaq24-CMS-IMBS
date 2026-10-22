"use client";

import { useEffect, useState } from "react";
import { Moon, Sun } from "lucide-react";
import { HardwareButton } from "@/components/echo/hardware-button";

export function ThemeToggle() {
  const [dark, setDark] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem("imbs-dark-mode");
    const enabled = saved === "dark" || (saved === null && window.matchMedia("(prefers-color-scheme: dark)").matches);
    document.documentElement.classList.toggle("dark", enabled);
    setDark(enabled);
    setReady(true);
  }, []);

  return (
    <HardwareButton
      variant="ghost"
      size="sm"
      disabled={!ready}
      icon={<span key={dark ? "sun" : "moon"} className="theme-toggle-icon">{dark ? <Sun aria-hidden="true" /> : <Moon aria-hidden="true" />}</span>}
      aria-pressed={dark}
      aria-label={dark ? "Ganti ke tema terang" : "Ganti ke tema gelap"}
      onClick={() => {
        const toggle = () => {
          const root = document.documentElement;
          root.classList.toggle("dark");
          const enabled = root.classList.contains("dark");
          localStorage.setItem("imbs-dark-mode", enabled ? "dark" : "light");
          setDark(enabled);
        };
        const viewTransitionDocument = document as Document & { startViewTransition?: (callback: () => void) => unknown };
        if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || !viewTransitionDocument.startViewTransition) toggle();
        else viewTransitionDocument.startViewTransition(toggle);
      }}
    >
      <span className="hidden sm:inline">{dark ? "Terang" : "Gelap"}</span>
    </HardwareButton>
  );
}

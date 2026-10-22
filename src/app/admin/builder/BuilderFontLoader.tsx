"use client";

import { useEffect } from "react";
import { googleFontStylesheet } from "./builder-fonts";

export function BuilderFontLoader({ families }: { families: string[] }) {
  const familyList = families.join("|");
  useEffect(() => {
    const added: HTMLLinkElement[] = [];
    for (const family of familyList ? familyList.split("|") : []) {
      const href = googleFontStylesheet(family);
      if (document.head.querySelector(`link[data-imbs-font="${family}"]`)) continue;
      const link = document.createElement("link");
      link.rel = "stylesheet";
      link.href = href;
      link.dataset.imbsFont = family;
      document.head.appendChild(link);
      added.push(link);
    }
    return () => added.forEach((link) => link.remove());
  }, [familyList]);

  return null;
}

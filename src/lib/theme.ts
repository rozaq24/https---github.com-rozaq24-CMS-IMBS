export const THEMES = [
  "emerald", "blue", "indigo", "violet", "rose",
  "orange", "teal", "cyan", "lime", "slate",
] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_META: Record<ThemeName, { label: string; grad: string }> = {
  emerald: { label: "Zamrud", grad: "linear-gradient(135deg,#047857,#6d28d9)" },
  blue: { label: "Biru", grad: "linear-gradient(135deg,#1d4ed8,#0e7490)" },
  indigo: { label: "Nila", grad: "linear-gradient(135deg,#4338ca,#7e22ce)" },
  violet: { label: "Ungu", grad: "linear-gradient(135deg,#7c3aed,#047857)" },
  rose: { label: "Merah Muda", grad: "linear-gradient(135deg,#be123c,#c2410c)" },
  orange: { label: "Oranye", grad: "linear-gradient(135deg,#c2410c,#047857)" },
  teal: { label: "Teal", grad: "linear-gradient(135deg,#0f766e,#4338ca)" },
  cyan: { label: "Sian", grad: "linear-gradient(135deg,#0e7490,#4338ca)" },
  lime: { label: "Limau", grad: "linear-gradient(135deg,#4d7c0f,#0f766e)" },
  slate: { label: "Abu", grad: "linear-gradient(135deg,#475569,#047857)" },
};

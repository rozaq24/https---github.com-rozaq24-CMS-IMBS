export const THEMES = [
  "emerald", "blue", "indigo", "violet", "rose",
  "orange", "teal", "cyan", "lime", "slate",
] as const;

export type ThemeName = (typeof THEMES)[number];

export const THEME_META: Record<ThemeName, { label: string; grad: string }> = {
  emerald: { label: "Zamrud", grad: "linear-gradient(135deg,#059669,#34d399)" },
  blue: { label: "Biru", grad: "linear-gradient(135deg,#2563eb,#60a5fa)" },
  indigo: { label: "Nila", grad: "linear-gradient(135deg,#4f46e5,#a78bfa)" },
  violet: { label: "Ungu", grad: "linear-gradient(135deg,#7c3aed,#c084fc)" },
  rose: { label: "Merah Muda", grad: "linear-gradient(135deg,#e11d48,#fb7185)" },
  orange: { label: "Oranye", grad: "linear-gradient(135deg,#ea580c,#fdba74)" },
  teal: { label: "Teal", grad: "linear-gradient(135deg,#0d9488,#5eead4)" },
  cyan: { label: "Sian", grad: "linear-gradient(135deg,#0891b2,#67e8f9)" },
  lime: { label: "Limau", grad: "linear-gradient(135deg,#65a30d,#bef264)" },
  slate: { label: "Abu", grad: "linear-gradient(135deg,#334155,#94a3b8)" },
};

export type BuilderElement = {
  id: string;
  type: "heading" | "text" | "button" | "shape" | "line" | "card" | "strip" | "container" | "icon";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  background: "paper" | "well" | "accent" | "solid" | "gradient" | "image" | "video";
  backgroundValue?: string;
  fontFamily?: "sans" | "serif" | "mono";
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: boolean;
  parentId?: string;
  href: string;
  shape: "rectangle" | "circle";
};

export type BuilderDocument = { version: 1; width: number; height: number; elements: BuilderElement[] };

export const EMPTY_DOCUMENT: BuilderDocument = { version: 1, width: 1200, height: 1600, elements: [] };

export function parseBuilderData(value?: string | null): BuilderDocument | null {
  if (!value) return null;
  try {
    const data = JSON.parse(value) as BuilderDocument;
    if (data.version !== 1 || !Array.isArray(data.elements) || data.elements.length > 200) return null;
    if (!Number.isFinite(data.width) || data.width < 320 || data.width > 2000 || !Number.isFinite(data.height) || data.height < 300 || data.height > 5000) return null;
    const elements = data.elements.filter((item) => item && typeof item.id === "string" && item.id.length <= 60 &&
      ["heading", "text", "button", "shape", "line", "card", "strip", "container", "icon"].includes(item.type) &&
      [item.x, item.y, item.width, item.height].every((n) => Number.isFinite(n) && n >= 0 && n <= 5000) &&
      typeof item.text === "string" && item.text.length <= 500 && typeof item.color === "string" && item.color.length <= 80 && ["paper", "well", "accent", "solid", "gradient", "image", "video"].includes(item.background) &&
      (item.backgroundValue === undefined || typeof item.backgroundValue === "string" && item.backgroundValue.length <= 1000) &&
      (item.background === "image" || item.background === "video" ? !item.backgroundValue || item.backgroundValue.startsWith("/") || /^https:\/\//i.test(item.backgroundValue) : true) &&
      (item.background === "gradient" ? !item.backgroundValue || /^(linear|radial)-gradient\([^;{}]+\)$/.test(item.backgroundValue) : true) &&
      (item.fontFamily === undefined || ["sans", "serif", "mono"].includes(item.fontFamily)) &&
      [item.fontSize, item.lineHeight, item.letterSpacing].every((n) => n === undefined || Number.isFinite(n) && Math.abs(n) <= 200) &&
      (item.textShadow === undefined || typeof item.textShadow === "boolean") &&
      (item.parentId === undefined || typeof item.parentId === "string" && item.parentId.length <= 60) &&
      (typeof item.href === "string" && item.href.length <= 500 && (item.href === "#" || item.href.startsWith("/") && !item.href.startsWith("//") || /^https:\/\//i.test(item.href))) &&
      (item.shape === "rectangle" || item.shape === "circle"));
    if (elements.length !== data.elements.length) return null;
    return { ...data, elements };
  } catch {
    return null;
  }
}

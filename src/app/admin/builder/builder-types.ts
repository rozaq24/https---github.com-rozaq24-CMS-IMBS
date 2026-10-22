import { FONT_FAMILY_SET } from "./builder-fonts";

export const COMPONENT_KINDS = [
  "accordion", "breadcrumb", "button", "card", "carousel", "chart", "checkbox", "code-block", "date-picker", "dialog", "dropdown-menu", "field", "hover-card", "input", "input-group",
  "spotlight-card", "aurora-background", "decrypted-text", "scroll-stack",
] as const;

export type BuilderComponentKind = (typeof COMPONENT_KINDS)[number];

export type BuilderElement = {
  id: string;
  type: "heading" | "text" | "button" | "shape" | "line" | "card" | "strip" | "container" | "icon" | "component";
  x: number;
  y: number;
  width: number;
  height: number;
  text: string;
  color: string;
  background: "paper" | "well" | "accent" | "solid" | "gradient" | "image" | "video";
  backgroundValue?: string;
  fontFamily?: string;
  fontSize?: number;
  lineHeight?: number;
  letterSpacing?: number;
  textShadow?: boolean;
  parentId?: string;
  anchorId?: string;
  componentKind?: BuilderComponentKind;
  href: string;
  shape: "rectangle" | "circle";
};

export type BuilderDocument = { version: 1; width: number; height: number; elements: BuilderElement[] };

export const EMPTY_DOCUMENT: BuilderDocument = { version: 1, width: 1200, height: 1600, elements: [] };

const ELEMENT_TYPES = ["heading", "text", "button", "shape", "line", "card", "strip", "container", "icon", "component"];
const BACKGROUNDS = ["paper", "well", "accent", "solid", "gradient", "image", "video"];
const SAFE_COLOR = /^(#[\da-f]{3,8}|var\(--echo-[\da-z-]+\)|(?:rgb|rgba|hsl|hsla)\([\d\s,.%+-]+\)|[a-z]{3,20})$/i;
const SAFE_GRADIENT = /^(?:linear-gradient\((?:(?:to (?:left|right|top|bottom)(?: (?:left|right|top|bottom))?|\d{1,3}deg)\s*,\s*)?(?:#[\da-f]{3,8}|var\(--echo-[\da-z-]+\)|(?:rgb|rgba|hsl|hsla)\([\d\s,.%+-]+\)|[a-z]{3,20})(?:\s+\d{1,3}%?)?(?:\s*,\s*(?:#[\da-f]{3,8}|var\(--echo-[\da-z-]+\)|(?:rgb|rgba|hsl|hsla)\([\d\s,.%+-]+\)|[a-z]{3,20})(?:\s+\d{1,3}%?)?){1,5}\)|radial-gradient\((?:circle|ellipse)?\s*,?\s*(?:#[\da-f]{3,8}|var\(--echo-[\da-z-]+\)|(?:rgb|rgba|hsl|hsla)\([\d\s,.%+-]+\)|[a-z]{3,20})(?:\s+\d{1,3}%?)?(?:\s*,\s*(?:#[\da-f]{3,8}|var\(--echo-[\da-z-]+\)|(?:rgb|rgba|hsl|hsla)\([\d\s,.%+-]+\)|[a-z]{3,20})(?:\s+\d{1,3}%?)?){1,5}\))$/i;

export function parseBuilderData(value?: string | null): BuilderDocument | null {
  if (!value) return null;
  try {
    const data = JSON.parse(value) as BuilderDocument;
    if (data.version !== 1 || !Array.isArray(data.elements) || data.elements.length > 200) return null;
    if (!Number.isFinite(data.width) || data.width < 320 || data.width > 2000 || !Number.isFinite(data.height) || data.height < 300 || data.height > 5000) return null;
    const elements = data.elements.filter((item) => item && typeof item.id === "string" && item.id.length <= 60 &&
      ELEMENT_TYPES.includes(item.type) &&
      [item.x, item.y, item.width, item.height].every((n) => Number.isFinite(n) && n >= 0 && n <= 5000) &&
      typeof item.text === "string" && item.text.length <= 500 && typeof item.color === "string" && item.color.length <= 80 && SAFE_COLOR.test(item.color) && BACKGROUNDS.includes(item.background) &&
      (item.backgroundValue === undefined || typeof item.backgroundValue === "string" && item.backgroundValue.length <= 1000) &&
      (item.background === "solid" ? !item.backgroundValue || SAFE_COLOR.test(item.backgroundValue) : true) &&
      (item.background === "image" || item.background === "video" ? !item.backgroundValue || item.backgroundValue.startsWith("/") && !item.backgroundValue.startsWith("//") || /^https:\/\//i.test(item.backgroundValue) : true) &&
      (item.background === "gradient" ? !item.backgroundValue || SAFE_GRADIENT.test(item.backgroundValue) : true) &&
      (item.fontFamily === undefined || ["sans", "serif", "mono"].includes(item.fontFamily) || FONT_FAMILY_SET.has(item.fontFamily)) &&
      (item.componentKind === undefined || (COMPONENT_KINDS as readonly string[]).includes(item.componentKind)) &&
      [item.fontSize, item.lineHeight, item.letterSpacing].every((n) => n === undefined || Number.isFinite(n) && Math.abs(n) <= 200) &&
      (item.textShadow === undefined || typeof item.textShadow === "boolean") &&
      (item.parentId === undefined || typeof item.parentId === "string" && item.parentId.length <= 60) &&
      (item.anchorId === undefined || typeof item.anchorId === "string" && /^[a-z0-9][a-z0-9-]{0,39}$/.test(item.anchorId)) &&
      (typeof item.href === "string" && item.href.length <= 500 && (item.href === "#" || item.href.startsWith("/") && !item.href.startsWith("//") || /^https:\/\//i.test(item.href))) &&
      (item.shape === "rectangle" || item.shape === "circle"));
    if (elements.length !== data.elements.length) return null;
    const ids = elements.map((item) => item.id);
    const anchors = elements.flatMap((item) => item.anchorId ? [item.anchorId] : []);
    if (new Set(ids).size !== ids.length || new Set(anchors).size !== anchors.length) return null;
    return { ...data, elements };
  } catch {
    return null;
  }
}

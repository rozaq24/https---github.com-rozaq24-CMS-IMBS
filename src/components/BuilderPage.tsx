import type { CSSProperties } from "react";
import { parseBuilderData } from "@/app/admin/builder/builder-types";
import { FONT_FAMILY_SET } from "@/app/admin/builder/builder-fonts";
import { BuilderFontLoader } from "@/app/admin/builder/BuilderFontLoader";
import { BuilderStaticComponent } from "@/app/admin/builder/BuilderStaticComponent";

export function BuilderPage({ data }: { data: string }) {
  const doc = parseBuilderData(data);
  if (!doc) return null;
  const fonts = Array.from(new Set(doc.elements.map((element) => element.fontFamily).filter((family): family is string => !!family && FONT_FAMILY_SET.has(family))));
  return <>
  <BuilderFontLoader families={fonts} />
  <section className="builder-public-canvas" style={{ aspectRatio: `${doc.width} / ${doc.height}` }}>
    {doc.elements.map((element) => {
      const button = element.type === "button";
      const surface = ["shape", "container", "card", "component"].includes(element.type);
      const style: CSSProperties = {
        left: `${element.x / doc.width * 100}%`,
        top: `${element.y / doc.height * 100}%`,
        width: `${element.width / doc.width * 100}%`,
        height: `${element.height / doc.height * 100}%`,
        color: button && element.background !== "solid" && element.background !== "gradient" ? "var(--echo-primary-cap-ink)" : element.color === "accent" ? "var(--echo-accent-ink)" : element.color === "text" ? "var(--echo-text)" : element.color,
        background: element.type === "line" ? "var(--echo-seam)" : button && element.background !== "solid" ? "var(--echo-primary-cap-mid)" : element.background === "solid" ? element.backgroundValue || "var(--echo-well)" : surface ? element.background === "accent" ? "var(--echo-accent-2)" : element.background === "well" ? "var(--echo-well)" : "var(--echo-paper-stock)" : "transparent",
        backgroundImage: element.background === "gradient" ? element.backgroundValue || "linear-gradient(120deg,var(--echo-well),var(--echo-paper-stock))" : (element.type === "strip" || surface) && element.background === "image" && element.backgroundValue ? `url(${JSON.stringify(element.backgroundValue)})` : undefined,
        backgroundSize: "cover",
        borderRadius: element.shape === "circle" ? "50%" : undefined,
        fontFamily: element.fontFamily === "serif" ? "Georgia,serif" : element.fontFamily === "mono" ? "var(--echo-font-mono)" : element.fontFamily && FONT_FAMILY_SET.has(element.fontFamily) ? `"${element.fontFamily}", sans-serif` : "var(--echo-font-sans)",
        fontSize: element.fontSize,
        lineHeight: element.lineHeight,
        letterSpacing: element.letterSpacing,
        textShadow: element.textShadow ? "0 1px 4px currentColor" : undefined,
      };
      const content = element.type === "heading" ? <h2>{element.text}</h2> : element.type === "component" && element.componentKind ? <BuilderStaticComponent kind={element.componentKind} text={element.text} /> : element.type === "line" || element.type === "shape" || element.type === "strip" ? null : element.text;
      return element.type === "button"
        ? <a id={element.anchorId || undefined} key={element.id} className="builder-public-element builder-public-button" style={style} href={element.href}>{content}</a>
        : <div id={element.anchorId || undefined} key={element.id} className={`builder-public-element builder-public-${element.type}`} style={style}>{element.type === "strip" && element.background === "video" && element.backgroundValue ? <video className="builder-public-strip-video" src={element.backgroundValue} autoPlay muted loop playsInline /> : null}{content}</div>;
    })}
  </section>
  </>;
}

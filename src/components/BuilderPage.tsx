import type { CSSProperties } from "react";
import { parseBuilderData } from "@/app/admin/builder/builder-types";

export function BuilderPage({ data }: { data: string }) {
  const doc = parseBuilderData(data);
  if (!doc) return null;
  return <section className="builder-public-canvas" style={{ aspectRatio: `${doc.width} / ${doc.height}` }}>
    {doc.elements.map((element) => {
      const style: CSSProperties = {
        left: `${element.x / doc.width * 100}%`,
        top: `${element.y / doc.height * 100}%`,
        width: `${element.width / doc.width * 100}%`,
        height: `${element.height / doc.height * 100}%`,
        color: element.type === "button" ? "var(--echo-primary-cap-ink)" : element.color === "accent" ? "var(--echo-accent-ink)" : element.color === "text" ? "var(--echo-text)" : element.color,
        background: element.type === "button" ? "var(--echo-primary-cap-mid)" : element.type === "shape" || element.type === "container" || element.type === "card" ? element.background === "accent" ? "var(--echo-accent-2)" : element.background === "well" ? "var(--echo-well)" : "var(--echo-paper-stock)" : element.type === "strip" && element.background === "solid" ? element.backgroundValue || "var(--echo-well)" : element.type === "line" ? "var(--echo-seam)" : "transparent",
        backgroundImage: element.type === "strip" && element.background === "gradient" ? element.backgroundValue || "linear-gradient(120deg,var(--echo-well),var(--echo-paper-stock))" : element.type === "strip" && element.background === "image" && element.backgroundValue ? `url(${JSON.stringify(element.backgroundValue)})` : undefined,
        backgroundSize: "cover",
        borderRadius: element.shape === "circle" ? "50%" : undefined,
        fontFamily: element.fontFamily === "serif" ? "Georgia,serif" : element.fontFamily === "mono" ? "var(--echo-font-mono)" : "var(--echo-font-sans)",
        fontSize: element.fontSize,
        lineHeight: element.lineHeight,
        letterSpacing: element.letterSpacing,
        textShadow: element.textShadow ? "0 1px 4px currentColor" : undefined,
      };
      const content = element.type === "heading" ? <h2>{element.text}</h2> : element.type === "line" || element.type === "shape" || element.type === "strip" ? null : element.text;
      return element.type === "button"
        ? <a key={element.id} className="builder-public-element builder-public-button" style={style} href={element.href}>{content}</a>
        : <div key={element.id} className={`builder-public-element builder-public-${element.type}`} style={style}>{element.type === "strip" && element.background === "video" && element.backgroundValue ? <video className="builder-public-strip-video" src={element.backgroundValue} autoPlay muted loop playsInline /> : null}{content}</div>;
    })}
  </section>;
}

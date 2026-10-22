"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ExternalLink, Eye, Grid2X2, Plus, Save, Search, Trash2, Files, PanelTop } from "lucide-react";
import { Field } from "@/components/echo/field";
import { Checkbox } from "@/components/echo/checkbox";
import { Accordion } from "@/components/echo/accordion";
import { Select } from "@/components/echo/select";
import { BuilderDocument, BuilderElement, BuilderComponentKind, EMPTY_DOCUMENT, parseBuilderData } from "./builder-types";
import { FONT_GROUPS, FONT_FAMILY_SET, type BuilderFontFamily } from "./builder-fonts";
import { BUILDER_TEMPLATES, type BuilderTemplateCategory } from "./builder-templates";
import { BuilderStaticComponent } from "./BuilderStaticComponent";
import { BuilderFlatButton, BuilderFlatChoice } from "./BuilderControls";
import { BuilderColorControls } from "./BuilderColorControls";
import { BuilderFontLoader } from "./BuilderFontLoader";
import "./builder.css";

const BLOCKS: { type: BuilderElement["type"]; label: string; width: number; height: number; text: string }[] = [
  { type: "heading", label: "Judul", width: 420, height: 74, text: "Judul halaman" },
  { type: "text", label: "Teks", width: 360, height: 90, text: "Tulis isi halaman di sini." },
  { type: "button", label: "Tombol", width: 190, height: 52, text: "Pelajari lebih lanjut" },
  { type: "strip", label: "Strip", width: 1200, height: 320, text: "" },
  { type: "container", label: "Kotak", width: 360, height: 220, text: "" },
  { type: "shape", label: "Bentuk", width: 120, height: 120, text: "" },
  { type: "line", label: "Garis", width: 280, height: 2, text: "" },
  { type: "icon", label: "Dekorasi", width: 72, height: 72, text: "✦" },
  { type: "component", label: "Komponen", width: 360, height: 220, text: "" },
];

const WIDTHS = [1200, 768, 390];
const WIDTH_LABELS = ["Desktop", "Tablet", "Ponsel"];
const CATALOGS = [
  { label: "Shadcn UI", href: "https://ui.shadcn.com/docs/components" },
  { label: "React Bits", href: "https://reactbits.dev/get-started/index" },
];
const TEMPLATE_SOURCES = [
  { label: "Squarespace", href: "https://www.squarespace.com/templates" },
  { label: "Wix", href: "https://www.wix.com/website/templates" },
  { label: "Figma Community", href: "https://www.figma.com/community" },
  { label: "shadcn/ui", href: "https://ui.shadcn.com/docs/components" },
  { label: "React Bits", href: "https://reactbits.dev/get-started/index" },
];
const SHADCN_COMPONENTS = ["Accordion", "Breadcrumb", "Button", "Card", "Carousel", "Chart", "Checkbox", "Code Block", "Date Picker", "Dialog", "Dropdown Menu", "Field", "Hover Card", "Input", "Input Group"] as const;
const TEMPLATE_GROUPS: { value: string; category: BuilderTemplateCategory; label: string; referenceHref?: string }[] = [
  { value: "basic", category: "Dasar", label: "Dasar" },
  { value: "blog", category: "Blog", label: "Blog", referenceHref: "https://www.squarespace.com/templates/browse/topic/all-templates/type/blog" },
  { value: "education", category: "Education", label: "Education", referenceHref: "https://www.squarespace.com/website-templates/education" },
  { value: "entertainment", category: "Entertainment", label: "Entertainment", referenceHref: "https://www.squarespace.com/templates/browse/topic/media-podcasts" },
];
const LIBRARY: { name: string; source: string; href: string; kind: string; componentKind: BuilderComponentKind }[] = [
  ...SHADCN_COMPONENTS.map((name) => ({
    name,
    source: "shadcn/ui",
    href: `https://ui.shadcn.com/docs/components/${name.toLowerCase().replaceAll(" ", "-")}`,
    kind: "Komponen statis",
    componentKind: name.toLowerCase().replaceAll(" ", "-") as BuilderComponentKind,
  })),
  { name: "Spotlight Card", source: "React Bits", href: "https://reactbits.dev/components/spotlight-card", kind: "Kartu", componentKind: "spotlight-card" },
  { name: "Aurora Background", source: "React Bits", href: "https://reactbits.dev/backgrounds/aurora", kind: "Latar", componentKind: "aurora-background" },
  { name: "Decrypted Text", source: "React Bits", href: "https://reactbits.dev/text-animations/decrypted-text", kind: "Teks", componentKind: "decrypted-text" },
  { name: "Scroll Stack", source: "React Bits", href: "https://reactbits.dev/components/scroll-stack", kind: "Susunan", componentKind: "scroll-stack" },
];

function newElement(type: BuilderElement["type"], index: number, componentKind?: BuilderComponentKind, text?: string): BuilderElement {
  const block = BLOCKS.find((item) => item.type === type)!;
  return { id: crypto.randomUUID(), type, x: type === "strip" ? 0 : 80 + (index % 3) * 30, y: 90 + index * 30, width: block.width, height: block.height, text: text ?? block.text, color: type === "button" ? "var(--echo-primary-cap-ink)" : "var(--echo-text)", background: type === "button" ? "accent" : type === "strip" ? "solid" : "paper", backgroundValue: type === "strip" ? "var(--echo-well)" : "", href: "#", shape: "rectangle", fontFamily: "Inter", fontSize: type === "heading" ? 32 : 16, lineHeight: 1.3, letterSpacing: 0, textShadow: false, componentKind };
}

function elementStyle(element: BuilderElement): CSSProperties {
  const button = element.type === "button" || element.componentKind === "button";
  const surface = ["shape", "container", "card", "component"].includes(element.type);
  const fontFamily = element.fontFamily === "serif" ? "Georgia,serif" : element.fontFamily === "mono" ? "var(--echo-font-mono)" : element.fontFamily && FONT_FAMILY_SET.has(element.fontFamily) ? `"${element.fontFamily}", sans-serif` : "var(--echo-font-sans)";
  return {
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    color: button && element.background !== "solid" && element.background !== "gradient" ? "var(--echo-primary-cap-ink)" : element.color === "accent" ? "var(--echo-accent-ink)" : element.color === "text" ? "var(--echo-text)" : element.color,
    background: element.type === "line" ? "var(--echo-seam)" : button && element.background !== "solid" ? "var(--echo-primary-cap-mid)" : element.background === "solid" ? element.backgroundValue || "var(--echo-well)" : surface ? element.background === "accent" ? "var(--echo-accent-2)" : element.background === "well" ? "var(--echo-well)" : "var(--echo-paper-stock)" : "transparent",
    backgroundImage: element.background === "gradient" ? element.backgroundValue || "linear-gradient(120deg,var(--echo-well),var(--echo-paper-stock))" : (element.type === "strip" || surface) && element.background === "image" && element.backgroundValue ? `url(${JSON.stringify(element.backgroundValue)})` : undefined,
    backgroundSize: "cover",
    borderRadius: element.shape === "circle" ? "50%" : undefined,
    fontFamily,
    fontSize: element.fontSize,
    lineHeight: element.lineHeight,
    letterSpacing: element.letterSpacing,
    textShadow: element.textShadow ? "0 1px 4px currentColor" : undefined,
  };
}

export function BuilderClient({ initial, pageId }: { initial?: { id: string; title: string; slug: string; showInMenu: boolean; order: number; builderData: string | null }; pageId?: string }) {
  const router = useRouter();
  const surface = useRef<HTMLDivElement>(null);
  const [doc, setDoc] = useState<BuilderDocument>(() => parseBuilderData(initial?.builderData) || EMPTY_DOCUMENT);
  const [selected, setSelected] = useState<string | null>(null);
  const [title, setTitle] = useState(initial?.title || "");
  const [slug, setSlug] = useState(initial?.slug || "");
  const [showInMenu, setShowInMenu] = useState(initial?.showInMenu ?? true);
  const [order, setOrder] = useState(String(initial?.order ?? 0));
  const [widthIndex, setWidthIndex] = useState(0);
  const [grid, setGrid] = useState(true);
  const [preview, setPreview] = useState(false);
  const [message, setMessage] = useState("");
  const [librarySearch, setLibrarySearch] = useState("");
  const [fontSearch, setFontSearch] = useState("");
  const [saving, setSaving] = useState(false);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const active = doc.elements.find((item) => item.id === selected);
  const canvasWidth = WIDTHS[widthIndex];
  const filteredLibrary = LIBRARY.filter((item) => `${item.name} ${item.source} ${item.kind}`.toLowerCase().includes(librarySearch.toLowerCase()));
  const libraryGroups = [
    { value: "shadcn", label: "shadcn/ui", items: filteredLibrary.filter((item) => item.source === "shadcn/ui") },
    { value: "react-bits", label: "React Bits", items: filteredLibrary.filter((item) => item.source === "React Bits") },
  ].filter((group) => group.items.length);
  const templateGroups = TEMPLATE_GROUPS.map((group) => ({ ...group, templates: BUILDER_TEMPLATES.filter((template) => template.category === group.category) }));
  const noLibraryMatches = filteredLibrary.length === 0;
  const marks = useMemo(() => Array.from({ length: Math.floor(canvasWidth / 100) + 1 }, (_, i) => i * 100), [canvasWidth]);
  const usedFonts = Array.from(new Set(doc.elements.map((item) => item.fontFamily).filter((family): family is string => !!family && FONT_FAMILY_SET.has(family))));
  const selectedFont: BuilderFontFamily = active?.fontFamily && FONT_FAMILY_SET.has(active.fontFamily) ? active.fontFamily as BuilderFontFamily : "Inter";
  const fontOptions = FONT_GROUPS.flatMap((group) => group.families.filter((family) => family.toLowerCase().includes(fontSearch.toLowerCase())).map((family) => ({ value: family, label: `${group.label.split(" ·")[0]} — ${family}` })));
  if (!fontOptions.some((option) => option.value === selectedFont)) fontOptions.unshift({ value: selectedFont, label: `Terpilih — ${selectedFont}` });

  function updateElement(id: string, change: Partial<BuilderElement>) {
    setDoc((current) => ({ ...current, elements: current.elements.map((item) => item.id === id ? { ...item, ...change } : item) }));
  }

  function add(type: BuilderElement["type"], componentKind?: BuilderComponentKind, text?: string) {
    if (doc.elements.length >= 200) { setMessage("Kanvas sudah mencapai batas 200 elemen."); return; }
    const item = newElement(type, doc.elements.length, componentKind, text);
    const parent = selected ? doc.elements.find((element) => element.id === selected && element.type === "container") : undefined;
    if (parent) { item.parentId = parent.id; item.x = parent.x + 20; item.y = parent.y + 20; }
    setDoc((current) => ({ ...current, elements: type === "strip" ? [item, ...current.elements] : [...current.elements, item] }));
    setSelected(item.id);
  }

  function useTemplate(templateId: string) {
    const template = BUILDER_TEMPLATES.find((item) => item.id === templateId);
    if (!template) return;
    if (doc.elements.length && !window.confirm("Template akan mengganti elemen di kanvas. Lanjutkan?")) return;
    setDoc(template.document);
    setSelected(null);
    setMessage(`Template “${template.title}” siap diedit.`);
  }

  function placeOnCanvas(event: ReactPointerEvent<HTMLDivElement>) {
    if (event.target !== surface.current || preview) return;
    setSelected(null);
  }

  function moveElement(event: ReactPointerEvent<HTMLDivElement>, item: BuilderElement) {
    if (preview || event.button !== 0) return;
    event.stopPropagation();
    const origin = { clientX: event.clientX, clientY: event.clientY, x: item.x, y: item.y };
    let last = { x: item.x, y: item.y };
    event.currentTarget.setPointerCapture(event.pointerId);
    const onMove = (move: globalThis.PointerEvent) => {
      const rect = surface.current?.getBoundingClientRect();
      if (!rect) return;
      const scale = rect.width / canvasWidth;
      let x = Math.max(0, Math.min(canvasWidth - item.width, origin.x + (move.clientX - origin.clientX) / scale));
      let y = Math.max(0, Math.min(doc.height - item.height, origin.y + (move.clientY - origin.clientY) / scale));
      let guideX: number | undefined;
      let guideY: number | undefined;
      const siblings = doc.elements.filter((other) => other.id !== item.id);
      for (const other of siblings) {
        for (const [edge, candidate] of [["left", other.x], ["center", other.x + other.width / 2], ["right", other.x + other.width]] as const) {
          const own = edge === "left" ? x : edge === "center" ? x + item.width / 2 : x + item.width;
          if (Math.abs(own - candidate) < 9) { x += candidate - own; guideX = candidate; }
        }
        for (const [edge, candidate] of [["top", other.y], ["center", other.y + other.height / 2], ["bottom", other.y + other.height]] as const) {
          const own = edge === "top" ? y : edge === "center" ? y + item.height / 2 : y + item.height;
          if (Math.abs(own - candidate) < 9) { y += candidate - own; guideY = candidate; }
        }
      }
      setGuides({ x: guideX, y: guideY });
      const dx = Math.round(x) - last.x;
      const dy = Math.round(y) - last.y;
      last = { x: Math.round(x), y: Math.round(y) };
      setDoc((current) => ({ ...current, elements: current.elements.map((element) => element.id === item.id ? { ...element, x: Math.round(x), y: Math.round(y) } : item.type === "container" && element.parentId === item.id ? { ...element, x: element.x + dx, y: element.y + dy } : element) }));
    };
    const onUp = () => {
      window.removeEventListener("pointermove", onMove);
      window.removeEventListener("pointerup", onUp);
      setGuides({});
    };
    window.addEventListener("pointermove", onMove);
    window.addEventListener("pointerup", onUp, { once: true });
    setSelected(item.id);
  }

  async function save() {
    setSaving(true);
    setMessage("");
    const body = { title, slug: slug || undefined, content: "<p>Halaman ini dibuat dengan IMBS Builder.</p>", builderData: JSON.stringify({ ...doc, width: canvasWidth }), showInMenu, order: Number(order) };
    try {
      const response = await fetch(pageId ? `/api/pages/${pageId}` : "/api/pages", { method: pageId ? "PATCH" : "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
      const result = await response.json();
      if (!response.ok) { setMessage(result.error || "Halaman gagal disimpan."); return; }
      setMessage(`Tersimpan · /${result.slug}`);
      if (!pageId) router.replace(`/admin/builder/${result.id}`);
      router.refresh();
    } catch {
      setMessage("Tidak dapat menyimpan halaman. Periksa koneksi lalu coba lagi.");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="imbs-builder">
      <BuilderFontLoader families={usedFonts} />
      <header className="builder-topbar">
        <div className="builder-identity">
          <Link href="/admin/builder" className="builder-back" aria-label="Kembali ke daftar IMBS Builder"><ArrowLeft size={16} /> Builder</Link>
          <div className="builder-page-fields"><Field label="Nama halaman" value={title} onValueChange={setTitle} /><Field label="Slug" value={slug} onValueChange={setSlug} mono /></div>
        </div>
        <div className="builder-actions">
          <Link className="builder-management-link" href="/admin/pages"><Files size={14} /> Kelola halaman</Link>
          <Link className="builder-management-link" href="/admin/menu"><PanelTop size={14} /> Menu & anchor</Link>
          {pageId && <a className="builder-preview-link" href={`/${slug}`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Lihat</a>}
          <BuilderFlatButton size="sm" icon={<Eye size={15} />} onClick={() => setPreview((value) => !value)} aria-label={preview ? "Kembali mengedit" : "Pratinjau halaman"}>{preview ? "Edit" : "Pratinjau"}</BuilderFlatButton>
          <BuilderFlatButton size="sm" icon={<Save size={15} />} loading={saving} onClick={save}>Simpan</BuilderFlatButton>
        </div>
      </header>

      <div className="builder-workspace">
        <aside className="builder-sidebar">
          <section className="builder-section">
            <h2>Elemen</h2>
            <div className="builder-palette">{BLOCKS.filter((block) => block.type !== "component").map((block) => <BuilderFlatButton key={block.type} size="sm" icon={<Plus size={13} />} onClick={() => add(block.type)}>{block.label}</BuilderFlatButton>)}</div>
          </section>
          <section className="builder-section">
            <h2>Kelola halaman</h2>
            <BuilderFlatButton size="sm" fullWidth href="/admin/builder/baru">Tambah halaman</BuilderFlatButton>
            <Link className="builder-catalog-link" href="/admin/pages">Duplikasi dan visibilitas halaman <ExternalLink size={13} /></Link>
            <Link className="builder-catalog-link" href="/admin/menu">Susun menu dan anchor <ExternalLink size={13} /></Link>
            <p>Menu dapat dibuat bertingkat hingga tiga level.</p>
          </section>
          <section className="builder-section">
            <h2>Pustaka elemen</h2>
            <Field label="Cari katalog" value={librarySearch} onValueChange={setLibrarySearch} start={<Search size={14} />} />
            <p>{SHADCN_COMPONENTS.length} pola shadcn/ui dan 4 pola React Bits tersedia sebagai blok statis yang aman untuk halaman publik.</p>
            <Accordion multiple>
              {libraryGroups.map((group) => (
                <Accordion.Item key={group.value} value={group.value}>
                  <Accordion.Trigger>{group.label}<span>{group.items.length}</span></Accordion.Trigger>
                  <Accordion.Panel>
                    {group.items.map((item) => (
                      <div className="builder-catalog-item" key={item.name}>
                        <span>{item.name}</span>
                        <BuilderFlatButton size="sm" onClick={() => add("component", item.componentKind, item.name)} aria-label={`Tambah ${item.name} ke kanvas`}>Tambah</BuilderFlatButton>
                        <a href={item.href} target="_blank" rel="noreferrer" aria-label={`Buka dokumentasi ${item.name}`}><ExternalLink size={13} /></a>
                      </div>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            {noLibraryMatches && <p role="status">Tidak ada elemen yang cocok dengan pencarian.</p>}
            {CATALOGS.map((item) => <a className="builder-catalog-link" key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}<ExternalLink size={13} /></a>)}
          </section>
          <section className="builder-section">
            <h2>Template halaman</h2>
            <p>Template dasar dan 13 layout orisinal yang dapat diedit: 3 blog, 5 education, dan 5 entertainment.</p>
            <Accordion multiple>
              {templateGroups.map((group) => (
                <Accordion.Item key={group.value} value={group.value}>
                  <Accordion.Trigger>{group.label}<span>{group.templates.length}</span></Accordion.Trigger>
                  <Accordion.Panel>
                    {group.referenceHref && <a className="builder-template-reference" href={group.referenceHref} target="_blank" rel="noreferrer">Lihat katalog Squarespace<ExternalLink size={13} /></a>}
                    {group.templates.map((template) => (
                      <div className="builder-template-item" key={template.id}>
                        <div><strong>{template.title}</strong><small>{template.description}</small></div>
                        <BuilderFlatButton size="sm" onClick={() => useTemplate(template.id)} aria-label={`Gunakan template ${template.title}`}>Gunakan</BuilderFlatButton>
                      </div>
                    ))}
                  </Accordion.Panel>
                </Accordion.Item>
              ))}
            </Accordion>
            <div className="builder-template-sources">{TEMPLATE_SOURCES.map((source) => <a key={source.label} href={source.href} target="_blank" rel="noreferrer">{source.label}</a>)}</div>
          </section>
          <section className="builder-section">
            <h2>Lapisan <span>{doc.elements.length}</span></h2>
            <div className="builder-layers">{[...doc.elements].reverse().map((item) => <BuilderFlatButton key={item.id} size="sm" fullWidth selected={selected === item.id} aria-pressed={selected === item.id} onClick={() => setSelected(item.id)}>{item.componentKind ? LIBRARY.find((block) => block.componentKind === item.componentKind)?.name : BLOCKS.find((block) => block.type === item.type)?.label} · {item.text || item.id.slice(0, 6)}</BuilderFlatButton>)}</div>
          </section>
        </aside>

        <section className="builder-stage" aria-label="Kanvas halaman">
          <div className="builder-stage-controls">
            <BuilderFlatChoice options={WIDTH_LABELS} value={widthIndex} onValueChange={setWidthIndex} ariaLabel="Ukuran pratinjau" />
            <BuilderFlatButton size="sm" selected={grid} aria-pressed={grid} icon={<Grid2X2 size={14} />} onClick={() => setGrid((value) => !value)} aria-label="Tampilkan gridlines">Grid</BuilderFlatButton>
          </div>
          <div className="builder-canvas-viewport">
            <div className="builder-ruler-top-row">
              <div className="builder-ruler-corner" />
              <div className="builder-ruler-top" style={{ width: canvasWidth }}>{marks.map((mark) => <span key={mark} style={{ left: mark }}>{mark}</span>)}</div>
            </div>
            <div className="builder-canvas-wrap">
              <div className="builder-ruler-side" style={{ height: doc.height }}>{Array.from({ length: 17 }, (_, i) => <span key={i} style={{ top: i * 100 }}>{i * 100}</span>)}</div>
              <div ref={surface} className={`builder-canvas${grid ? " has-grid" : ""}`} style={{ width: canvasWidth, height: doc.height }} onPointerDown={placeOnCanvas}>
                {!doc.elements.length && <p className="builder-empty">Pilih elemen dari panel kiri untuk mulai menyusun halaman.</p>}
                {guides.x !== undefined && <i className="builder-guide-x" style={{ left: guides.x }} />}
                {guides.y !== undefined && <i className="builder-guide-y" style={{ top: guides.y }} />}
                {doc.elements.map((item) => (
                  <div key={item.id} id={item.anchorId || undefined} className={`builder-element builder-element-${item.type}${selected === item.id && !preview ? " is-selected" : ""}${preview ? " is-preview" : ""}`} style={elementStyle(item)} role="button" aria-label={`${item.componentKind ? LIBRARY.find((block) => block.componentKind === item.componentKind)?.name : BLOCKS.find((block) => block.type === item.type)?.label}: ${item.text || "elemen dekoratif"}`} tabIndex={preview ? -1 : 0} onPointerDown={(event) => moveElement(event, item)} onKeyDown={(event) => {
                    if (preview) return;
                    if (["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(event.key)) {
                      event.preventDefault();
                      setSelected(item.id);
                      const step = event.shiftKey ? 10 : 1;
                      const x = Math.max(0, item.x + (event.key === "ArrowLeft" ? -step : event.key === "ArrowRight" ? step : 0));
                      const y = Math.max(0, item.y + (event.key === "ArrowUp" ? -step : event.key === "ArrowDown" ? step : 0));
                      const dx = x - item.x;
                      const dy = y - item.y;
                      setDoc((current) => ({ ...current, elements: current.elements.map((element) => element.id === item.id ? { ...element, x, y } : item.type === "container" && element.parentId === item.id ? { ...element, x: element.x + dx, y: element.y + dy } : element) }));
                    }
                  }} onDoubleClick={() => !preview && setSelected(item.id)}>
                    {item.type === "heading" ? <strong>{item.text}</strong> : item.type === "button" ? <span>{item.text}</span> : item.type === "component" && item.componentKind ? <BuilderStaticComponent kind={item.componentKind} text={item.text} /> : item.type === "line" || item.type === "shape" ? null : item.type === "strip" ? item.background === "video" && item.backgroundValue ? <video className="builder-strip-video" src={item.backgroundValue} autoPlay muted loop playsInline /> : null : item.text}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        <aside className="builder-inspector">
          <section className="builder-section">
            <h2>Pengaturan halaman</h2>
            <label className="builder-check"><Checkbox aria-labelledby="builder-show-menu" checked={showInMenu} onCheckedChange={setShowInMenu} /><span id="builder-show-menu">Tampilkan di menu</span></label>
            <Field label="Urutan menu" type="number" value={order} onValueChange={setOrder} />
            <p className="builder-hint">Posisi elemen disusun pada kanvas desktop. Lebar tablet dan ponsel hanya pratinjau.</p>
          </section>
          {active ? <section className="builder-section">
            <div className="builder-inspector-title"><h2>Elemen dipilih</h2><BuilderFlatButton size="sm" icon={<Trash2 size={14} />} onClick={() => { setDoc((current) => ({ ...current, elements: current.elements.filter((item) => item.id !== active.id && item.parentId !== active.id) })); setSelected(null); }} aria-label="Hapus elemen" /></div>
            {active.type !== "shape" && active.type !== "line" && active.type !== "strip" && <Field label="Teks" value={active.text} onValueChange={(text) => updateElement(active.id, { text })} />}
            {active.type === "button" && <Field label="Tautan tombol" value={active.href} onValueChange={(href) => updateElement(active.id, { href })} description="Gunakan #, tautan lokal, atau URL HTTPS." />}
            {active.type !== "line" && active.type !== "shape" && <Field label="Anchor ID" value={active.anchorId ?? ""} onValueChange={(value) => {
              const anchorId = value.toLowerCase().replace(/[^a-z0-9-]/g, "").slice(0, 40);
              if (anchorId && doc.elements.some((element) => element.id !== active.id && element.anchorId === anchorId)) { setMessage("Anchor ID tersebut sudah digunakan."); return; }
              setMessage("");
              updateElement(active.id, { anchorId: anchorId || undefined });
            }} description="Menu dapat menautkan ke ID ini, misalnya program-unggulan." />}
            <div className="builder-inspector-grid"><Field label="X" type="number" value={String(active.x)} onValueChange={(value) => updateElement(active.id, { x: Math.max(0, Number(value) || 0) })} /><Field label="Y" type="number" value={String(active.y)} onValueChange={(value) => updateElement(active.id, { y: Math.max(0, Number(value) || 0) })} /></div>
            {active.type !== "line" && <div className="builder-inspector-grid"><Field label="Lebar" type="number" value={String(active.width)} onValueChange={(value) => updateElement(active.id, { width: Math.max(1, Number(value) || 1) })} /><Field label="Tinggi" type="number" value={String(active.height)} onValueChange={(value) => updateElement(active.id, { height: Math.max(1, Number(value) || 1) })} /></div>}
            {(active.type === "shape" || active.type === "container") && <BuilderFlatChoice options={["Kertas", "Well", "Aksen"]} value={active.background === "accent" ? 2 : active.background === "well" ? 1 : 0} onValueChange={(value) => updateElement(active.id, { background: value === 2 ? "accent" : value === 1 ? "well" : "paper" })} ariaLabel="Warna latar elemen" />}
            {active.type === "shape" && <BuilderFlatChoice options={["Persegi", "Lingkaran"]} value={active.shape === "circle" ? 1 : 0} onValueChange={(value) => updateElement(active.id, { shape: value === 1 ? "circle" : "rectangle" })} ariaLabel="Jenis bentuk" />}
            {active.type !== "line" && active.type !== "icon" && <BuilderColorControls
              key={active.id}
              label={active.type === "text" || active.type === "heading" ? "Warna teks" : "Palet warna"}
              value={active.type === "text" || active.type === "heading" ? active.color : active.background === "solid" ? active.backgroundValue || "#30564a" : "#30564a"}
              allowGradient
              onColorChange={(color) => active.type === "text" || active.type === "heading" ? updateElement(active.id, { color }) : updateElement(active.id, { background: "solid", backgroundValue: color })}
              onGradientChange={(backgroundValue) => updateElement(active.id, { background: "gradient", backgroundValue })}
            />}
            {active.type === "text" || active.type === "heading" ? <>
              <Field label="Ukuran font (px)" type="number" value={String(active.fontSize ?? 16)} onValueChange={(value) => updateElement(active.id, { fontSize: Math.max(8, Math.min(120, Number(value) || 16)) })} />
              <Field label="Cari 100 font" value={fontSearch} onValueChange={setFontSearch} start={<Search size={14} />} />
              <p className="builder-hint">20 administrasi, 30 tampilan gambar, dan 50 geometrik. Font dimuat saat dipakai dari Google Fonts; acuan kategori: <a href="https://www.1001fonts.com/free-for-commercial-use-fonts.html" target="_blank" rel="noreferrer">1001Fonts</a>.</p>
              <Select aria-label="Keluarga font" value={selectedFont} options={fontOptions} onValueChange={(fontFamily) => FONT_FAMILY_SET.has(fontFamily) && updateElement(active.id, { fontFamily: fontFamily as BuilderFontFamily })} />
              <div className="builder-inspector-grid"><Field label="Jarak baris" type="number" value={String(active.lineHeight ?? 1.3)} onValueChange={(value) => updateElement(active.id, { lineHeight: Number(value) || 1.3 })} /><Field label="Jarak huruf (px)" type="number" value={String(active.letterSpacing ?? 0)} onValueChange={(value) => updateElement(active.id, { letterSpacing: Number(value) || 0 })} /></div>
              <label className="builder-check"><Checkbox aria-label="Bayangan teks" checked={active.textShadow ?? false} onCheckedChange={(textShadow) => updateElement(active.id, { textShadow })} /><span>Bayangan teks</span></label>
            </> : null}
            {active.type === "strip" && <>
              <BuilderFlatChoice options={["Solid", "Gradasi", "Gambar", "Video"]} value={["solid", "gradient", "image", "video"].indexOf(active.background)} onValueChange={(value) => updateElement(active.id, { background: ["solid", "gradient", "image", "video"][value] as BuilderElement["background"] })} ariaLabel="Jenis latar strip" />
              {(active.background === "image" || active.background === "video") && <Field label={active.background === "image" ? "URL gambar" : "URL video"} value={active.backgroundValue ?? ""} onValueChange={(backgroundValue) => updateElement(active.id, { backgroundValue })} description={active.background === "video" ? "Video akan tampil sebagai latar mandiri saat halaman diterbitkan." : "Gunakan URL HTTPS atau jalur media lokal."} />}
            </>}
          </section> : <section className="builder-section"><h2>Properti</h2><p>Pilih elemen di kanvas atau lapisan untuk mengubah posisi dan ukurannya.</p></section>}
          {message && <p className="builder-message" role="status">{message}</p>}
        </aside>
      </div>
    </div>
  );
}

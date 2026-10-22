"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from "react";
import { ArrowLeft, ExternalLink, Eye, Grid2X2, Plus, Save, Search, Trash2 } from "lucide-react";
import { Field } from "@/components/echo/field";
import { Checkbox } from "@/components/echo/checkbox";
import { HardwareButton } from "@/components/echo/hardware-button";
import { Segmented } from "@/components/echo/segmented";
import { BuilderDocument, BuilderElement, EMPTY_DOCUMENT, parseBuilderData } from "./builder-types";
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
];

const WIDTHS = [1200, 768, 390];
const WIDTH_LABELS = ["Desktop", "Tablet", "Ponsel"];
const CATALOGS = [
  { label: "Shadcn UI", href: "https://ui.shadcn.com/docs/components" },
  { label: "React Bits", href: "https://reactbits.dev/get-started/index" },
];
const LIBRARY = [
  { name: "Button", source: "Shadcn UI", href: "https://ui.shadcn.com/docs/components/base/button", kind: "Kontrol", type: "button" },
  { name: "Card", source: "Shadcn UI", href: "https://ui.shadcn.com/docs/components/base/card", kind: "Kontainer", type: "container" },
  { name: "Typography", source: "Shadcn UI", href: "https://ui.shadcn.com/docs/components/base/typography", kind: "Teks", type: "heading" },
  { name: "Separator", source: "Shadcn UI", href: "https://ui.shadcn.com/docs/components/base/separator", kind: "Dekorasi", type: "line" },
  { name: "Holo Card", source: "React Bits", href: "https://reactbits.dev/components/holo-card", kind: "Kartu", type: "container" },
  { name: "Gradient ASCII", source: "React Bits", href: "https://reactbits.dev/backgrounds/gradient-ascii", kind: "Latar", type: "strip" },
  { name: "Pattern Waves", source: "React Bits", href: "https://reactbits.dev/backgrounds/pattern-waves", kind: "Latar", type: "strip" },
  { name: "Tech Text", source: "React Bits", href: "https://reactbits.dev/text-animations/tech-text", kind: "Teks", type: "text" },
];

function newElement(type: BuilderElement["type"], index: number): BuilderElement {
  const block = BLOCKS.find((item) => item.type === type)!;
  return { id: crypto.randomUUID(), type, x: type === "strip" ? 0 : 80 + (index % 3) * 30, y: 90 + index * 30, width: block.width, height: block.height, text: block.text, color: "var(--echo-text)", background: type === "button" ? "accent" : type === "strip" ? "solid" : "paper", backgroundValue: type === "strip" ? "var(--echo-well)" : "", href: "#", shape: "rectangle", fontFamily: "sans", fontSize: type === "heading" ? 32 : 16, lineHeight: 1.3, letterSpacing: 0, textShadow: false };
}

function elementStyle(element: BuilderElement): CSSProperties {
  return {
    left: element.x,
    top: element.y,
    width: element.width,
    height: element.height,
    color: element.type === "button" ? "var(--echo-primary-cap-ink)" : element.color === "accent" ? "var(--echo-accent-ink)" : element.color === "text" ? "var(--echo-text)" : element.color,
    background: element.type === "line" ? "var(--echo-seam)" : element.type === "button" ? "var(--echo-primary-cap-mid)" : element.type === "shape" || element.type === "container" || element.type === "card" ? element.background === "accent" ? "var(--echo-accent-2)" : element.background === "well" ? "var(--echo-well)" : "var(--echo-paper-stock)" : element.type === "strip" && element.background === "solid" ? element.backgroundValue || "var(--echo-well)" : "transparent",
    backgroundImage: element.type === "strip" && element.background === "gradient" ? element.backgroundValue || "linear-gradient(120deg,var(--echo-well),var(--echo-paper-stock))" : element.type === "strip" && element.background === "image" && element.backgroundValue ? `url(${JSON.stringify(element.backgroundValue)})` : undefined,
    backgroundSize: "cover",
    borderRadius: element.shape === "circle" ? "50%" : undefined,
    fontFamily: element.fontFamily === "serif" ? "Georgia,serif" : element.fontFamily === "mono" ? "var(--echo-font-mono)" : "var(--echo-font-sans)",
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
  const [saving, setSaving] = useState(false);
  const [guides, setGuides] = useState<{ x?: number; y?: number }>({});
  const active = doc.elements.find((item) => item.id === selected);
  const canvasWidth = WIDTHS[widthIndex];
  const marks = useMemo(() => Array.from({ length: Math.floor(canvasWidth / 100) + 1 }, (_, i) => i * 100), [canvasWidth]);

  function updateElement(id: string, change: Partial<BuilderElement>) {
    setDoc((current) => ({ ...current, elements: current.elements.map((item) => item.id === id ? { ...item, ...change } : item) }));
  }

  function add(type: BuilderElement["type"]) {
    const item = newElement(type, doc.elements.length);
    const parent = selected ? doc.elements.find((element) => element.id === selected && element.type === "container") : undefined;
    if (parent) { item.parentId = parent.id; item.x = parent.x + 20; item.y = parent.y + 20; }
    setDoc((current) => ({ ...current, elements: type === "strip" ? [item, ...current.elements] : [...current.elements, item] }));
    setSelected(item.id);
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
      <header className="builder-topbar">
        <Link href="/admin/builder" className="builder-back" aria-label="Kembali ke daftar IMBS Builder"><ArrowLeft size={16} /> Builder</Link>
        <div className="builder-page-fields"><Field label="Nama halaman" value={title} onValueChange={setTitle} /><Field label="Slug" value={slug} onValueChange={setSlug} mono /></div>
        <div className="builder-actions">
          {pageId && <a className="builder-preview-link" href={`/${slug}`} target="_blank" rel="noreferrer"><ExternalLink size={15} /> Lihat</a>}
          <HardwareButton variant="neutral" size="sm" icon={<Eye size={15} />} onClick={() => setPreview((value) => !value)} aria-label={preview ? "Kembali mengedit" : "Pratinjau halaman"}>{preview ? "Edit" : "Pratinjau"}</HardwareButton>
          <HardwareButton variant="primary" size="sm" icon={<Save size={15} />} loading={saving} onClick={save}>Simpan</HardwareButton>
        </div>
      </header>

      <div className="builder-workspace">
        <aside className="builder-sidebar">
          <section className="builder-section">
            <h2>Elemen</h2>
            <div className="builder-palette">{BLOCKS.map((block) => <HardwareButton key={block.type} variant="neutral" size="sm" icon={<Plus size={13} />} onClick={() => add(block.type)}>{block.label}</HardwareButton>)}</div>
          </section>
          <section className="builder-section">
            <h2>Pustaka elemen</h2>
            <Field label="Cari katalog" value={librarySearch} onValueChange={setLibrarySearch} start={<Search size={14} />} />
            <p>Pola yang kompatibel dibangun ulang sebagai elemen statis, bukan menjalankan kode pihak ketiga.</p>
            {LIBRARY.filter((item) => `${item.name} ${item.source} ${item.kind}`.toLowerCase().includes(librarySearch.toLowerCase())).map((item) => <div className="builder-catalog-item" key={item.name}><span>{item.name} · {item.source}</span><HardwareButton variant="neutral" size="sm" onClick={() => add(item.type as BuilderElement["type"])} aria-label={`Tambah ${item.name} ke kanvas`}>Tambah</HardwareButton><a href={item.href} target="_blank" rel="noreferrer" aria-label={`Buka dokumentasi ${item.name}`}><ExternalLink size={13} /></a></div>)}
            {CATALOGS.map((item) => <a className="builder-catalog-link" key={item.label} href={item.href} target="_blank" rel="noreferrer">{item.label}<ExternalLink size={13} /></a>)}
          </section>
          <section className="builder-section">
            <h2>Lapisan <span>{doc.elements.length}</span></h2>
            <div className="builder-layers">{[...doc.elements].reverse().map((item) => <HardwareButton key={item.id} variant={selected === item.id ? "primary" : "neutral"} size="sm" fullWidth onClick={() => setSelected(item.id)}>{BLOCKS.find((block) => block.type === item.type)?.label} · {item.text || item.id.slice(0, 6)}</HardwareButton>)}</div>
          </section>
        </aside>

        <section className="builder-stage" aria-label="Kanvas halaman">
          <div className="builder-stage-controls">
            <Segmented options={WIDTH_LABELS} value={widthIndex} onValueChange={setWidthIndex} aria-label="Ukuran pratinjau" />
            <HardwareButton variant={grid ? "primary" : "neutral"} size="sm" icon={<Grid2X2 size={14} />} onClick={() => setGrid((value) => !value)} aria-label="Tampilkan gridlines">Grid</HardwareButton>
          </div>
          <div className="builder-ruler-top" style={{ width: canvasWidth }}>{marks.map((mark) => <span key={mark} style={{ left: mark }}>{mark}</span>)}</div>
          <div className="builder-canvas-wrap">
            <div className="builder-ruler-side">{Array.from({ length: 17 }, (_, i) => <span key={i} style={{ top: i * 100 }}>{i * 100}</span>)}</div>
            <div ref={surface} className={`builder-canvas${grid ? " has-grid" : ""}`} style={{ width: canvasWidth, height: doc.height }} onPointerDown={placeOnCanvas}>
              {!doc.elements.length && <p className="builder-empty">Pilih elemen dari panel kiri untuk mulai menyusun halaman.</p>}
              {guides.x !== undefined && <i className="builder-guide-x" style={{ left: guides.x }} />}
              {guides.y !== undefined && <i className="builder-guide-y" style={{ top: guides.y }} />}
              {doc.elements.map((item) => (
                <div key={item.id} className={`builder-element builder-element-${item.type}${selected === item.id && !preview ? " is-selected" : ""}${preview ? " is-preview" : ""}`} style={elementStyle(item)} role="button" aria-label={`${BLOCKS.find((block) => block.type === item.type)?.label}: ${item.text || "elemen dekoratif"}`} tabIndex={preview ? -1 : 0} onPointerDown={(event) => moveElement(event, item)} onKeyDown={(event) => {
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
                  {item.type === "heading" ? <strong>{item.text}</strong> : item.type === "button" ? <span>{item.text}</span> : item.type === "line" || item.type === "shape" ? null : item.type === "strip" ? item.background === "video" && item.backgroundValue ? <video className="builder-strip-video" src={item.backgroundValue} autoPlay muted loop playsInline /> : null : item.text}
                </div>
              ))}
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
            <div className="builder-inspector-title"><h2>Elemen dipilih</h2><HardwareButton variant="neutral" size="sm" icon={<Trash2 size={14} />} onClick={() => { setDoc((current) => ({ ...current, elements: current.elements.filter((item) => item.id !== active.id && item.parentId !== active.id) })); setSelected(null); }} aria-label="Hapus elemen" /></div>
            {active.type !== "shape" && active.type !== "line" && active.type !== "strip" && <Field label="Teks" value={active.text} onValueChange={(text) => updateElement(active.id, { text })} />}
            {active.type === "button" && <Field label="Tautan tombol" value={active.href} onValueChange={(href) => updateElement(active.id, { href })} description="Gunakan #, tautan lokal, atau URL HTTPS." />}
            <div className="builder-inspector-grid"><Field label="X" type="number" value={String(active.x)} onValueChange={(value) => updateElement(active.id, { x: Math.max(0, Number(value) || 0) })} /><Field label="Y" type="number" value={String(active.y)} onValueChange={(value) => updateElement(active.id, { y: Math.max(0, Number(value) || 0) })} /></div>
            {active.type !== "line" && <div className="builder-inspector-grid"><Field label="Lebar" type="number" value={String(active.width)} onValueChange={(value) => updateElement(active.id, { width: Math.max(1, Number(value) || 1) })} /><Field label="Tinggi" type="number" value={String(active.height)} onValueChange={(value) => updateElement(active.id, { height: Math.max(1, Number(value) || 1) })} /></div>}
            {(active.type === "shape" || active.type === "container") && <Segmented options={["Kertas", "Well", "Aksen"]} value={active.background === "accent" ? 2 : active.background === "well" ? 1 : 0} onValueChange={(value) => updateElement(active.id, { background: value === 2 ? "accent" : value === 1 ? "well" : "paper" })} aria-label="Warna latar elemen" />}
            {active.type === "shape" && <Segmented options={["Persegi", "Lingkaran"]} value={active.shape === "circle" ? 1 : 0} onValueChange={(value) => updateElement(active.id, { shape: value === 1 ? "circle" : "rectangle" })} aria-label="Jenis bentuk" />}
            {active.type === "text" || active.type === "heading" ? <>
              <Field label="Warna teks" value={active.color} onValueChange={(color) => updateElement(active.id, { color })} />
              <Field label="Ukuran font (px)" type="number" value={String(active.fontSize ?? 16)} onValueChange={(value) => updateElement(active.id, { fontSize: Math.max(8, Math.min(120, Number(value) || 16)) })} />
              <Segmented options={["Sans", "Serif", "Mono"]} value={active.fontFamily === "serif" ? 1 : active.fontFamily === "mono" ? 2 : 0} onValueChange={(value) => updateElement(active.id, { fontFamily: value === 1 ? "serif" : value === 2 ? "mono" : "sans" })} aria-label="Jenis font" />
              <div className="builder-inspector-grid"><Field label="Jarak baris" type="number" value={String(active.lineHeight ?? 1.3)} onValueChange={(value) => updateElement(active.id, { lineHeight: Number(value) || 1.3 })} /><Field label="Jarak huruf (px)" type="number" value={String(active.letterSpacing ?? 0)} onValueChange={(value) => updateElement(active.id, { letterSpacing: Number(value) || 0 })} /></div>
              <Checkbox aria-label="Bayangan teks" checked={active.textShadow ?? false} onCheckedChange={(textShadow) => updateElement(active.id, { textShadow })} />
            </> : null}
            {active.type === "strip" && <>
              <Segmented options={["Solid", "Gradasi", "Gambar", "Video"]} value={["solid", "gradient", "image", "video"].indexOf(active.background)} onValueChange={(value) => updateElement(active.id, { background: ["solid", "gradient", "image", "video"][value] as BuilderElement["background"] })} aria-label="Jenis latar strip" />
              <Field label={active.background === "solid" ? "Warna latar" : active.background === "gradient" ? "CSS gradasi" : active.background === "image" ? "URL gambar" : "URL video"} value={active.backgroundValue ?? ""} onValueChange={(backgroundValue) => updateElement(active.id, { backgroundValue })} description={active.background === "video" ? "Video akan tampil sebagai latar mandiri saat halaman diterbitkan." : undefined} />
            </>}
          </section> : <section className="builder-section"><h2>Properti</h2><p>Pilih elemen di kanvas atau lapisan untuk mengubah posisi dan ukurannya.</p></section>}
          {message && <p className="builder-message" role="status">{message}</p>}
        </aside>
      </div>
    </div>
  );
}

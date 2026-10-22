import type { BuilderComponentKind } from "./builder-types";
import { Checkbox } from "@/components/echo/checkbox";
import { Field } from "@/components/echo/field";
import { LcdChip } from "@/components/echo/lcd-chip";
import { BuilderFlatButton } from "./BuilderControls";

export function BuilderStaticComponent({ kind, text }: { kind: BuilderComponentKind; text: string }) {
  switch (kind) {
    case "accordion":
      return <div className="builder-component builder-component-accordion"><p><strong>{text || "Informasi penting"}</strong><span>−</span></p><div>Tambahkan jawaban atau keterangan singkat di sini.</div></div>;
    case "breadcrumb":
      return <nav className="builder-component builder-component-breadcrumb" aria-label="Breadcrumb"><span>Beranda</span><i>/</i><span>Informasi</span><i>/</i><strong>{text || "Halaman"}</strong></nav>;
    case "button":
      return <BuilderFlatButton type="button" disabled>{text || "Tombol tindakan"}</BuilderFlatButton>;
    case "card":
    case "spotlight-card":
      return <article className={`builder-component builder-component-card${kind === "spotlight-card" ? " is-spotlight" : ""}`}><span className="builder-component-kicker">INFORMASI</span><strong>{text || "Judul kartu"}</strong><p>Ringkasan singkat untuk membantu pengunjung memahami informasi ini.</p></article>;
    case "carousel":
      return <div className="builder-component builder-component-carousel"><article><strong>{text || "Sorotan sekolah"}</strong><p>Konten pilihan pertama</p></article><article><strong>Program terbaru</strong><p>Konten pilihan berikutnya</p></article><div aria-hidden="true">‹　●　○　›</div></div>;
    case "chart":
      return <div className="builder-component builder-component-chart" role="img" aria-label={text || "Grafik ringkasan"}><strong>{text || "Ringkasan data"}</strong><div className="builder-chart-bars">{[48, 76, 60, 92, 68].map((height, i) => <i key={i} style={{ height: `${height}%` }} />)}</div><small>2022　2023　2024　2025　2026</small></div>;
    case "checkbox":
      return <label className="builder-component builder-component-check"><Checkbox aria-label={text || "Saya memahami informasi ini"} disabled /><span>{text || "Saya memahami informasi ini"}</span></label>;
    case "code-block":
      return <pre className="builder-component builder-component-code"><code>{text || "Informasi teknis atau contoh kode"}</code></pre>;
    case "date-picker":
      return <div className="builder-component builder-component-field"><Field label={text || "Pilih tanggal"} type="date" disabled /></div>;
    case "dialog":
      return <div className="builder-component builder-component-dialog"><span className="builder-component-kicker">DIALOG</span><strong>{text || "Judul dialog"}</strong><p>Panel informasi statis dengan deskripsi singkat.</p><BuilderFlatButton size="sm" disabled>Tutup</BuilderFlatButton></div>;
    case "dropdown-menu":
      return <div className="builder-component builder-component-dropdown"><strong>{text || "Menu pilihan"}　⌄</strong><span>Profil sekolah</span><span>Akademik</span><span>Hubungi kami</span></div>;
    case "field":
      return <div className="builder-component builder-component-field"><Field label={text || "Nama lengkap"} disabled placeholder="Tulis jawaban di sini" /><Field label="Email" type="email" disabled placeholder="nama@email.com" /><BuilderFlatButton size="sm" disabled>Kirim pesan</BuilderFlatButton></div>;
    case "hover-card":
      return <div className="builder-component builder-component-hover"><span>{text || "Arahkan untuk detail"}</span><strong>Informasi tambahan</strong><small>Detail singkat yang memperjelas topik.</small></div>;
    case "input":
      return <div className="builder-component builder-component-field"><Field label={text || "Nama"} disabled placeholder="Masukkan teks" /></div>;
    case "input-group":
      return <div className="builder-component builder-component-input-group"><span>https://</span><div className="builder-component-lcd-well"><LcdChip label={text || "Alamat situs"} value="sekolah.sch.id" glow={false} /></div></div>;
    case "aurora-background":
      return <div className="builder-component builder-component-aurora"><strong>{text || "Ruang belajar yang menginspirasi"}</strong></div>;
    case "decrypted-text":
      return <strong className="builder-component-decrypted">{text || "Belajar dan bertumbuh bersama"}</strong>;
    case "scroll-stack":
      return <div className="builder-component builder-component-stack"><strong>{text || "Cerita sekolah"}</strong><span>Kegiatan</span><span>Prestasi</span><span>Komunitas</span></div>;
  }
}

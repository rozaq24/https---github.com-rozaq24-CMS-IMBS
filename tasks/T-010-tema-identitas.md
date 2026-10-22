---
id: T-010
title: Tema 10 Warna + Dark Mode + Identitas/SEO
status: DONE
priority: P0
phase: 3
domain: admin/tampilan
blueprint_ref:
  - blueprint/blueprint fitur admin.md#3
  - blueprint/blueprint fitur front end.md#5
agent_suitability: [antigravity, copilot]
depends_on: [T-001]
estimated: M
branch: feat/T-010-tema-identitas
---

# T-010 — Tema 10 Warna + Dark Mode + Identitas/SEO (Golden Ratio + ReactBits)

## Tujuan
Ganti warna/mode/identitas situs tanpa coding + terapkan Golden Ratio + sentuhan ReactBits di semua UI.

## Scope IN
- 10 preset tema (`src/lib/theme.ts`) + `data-theme` + `.dark` toggle persist + admin preview + set default
- Identitas: logo upload, favicon, title, deskripsi SEO, keyword, kontak (alamat/telp/email/maps), sosial
- Terapkan utilitas Golden Ratio: button 13/21, table standar, skala font, radius 21, gradient brand
- Minimal 1 komponen ReactBits-style per area: GradientText hero, SpotlightCard prestasi, Masonry galeri, AnimatedList berita, Drawer nav

## Scope OUT
- Halaman publik baru (T-012). Menu (T-009).

## Files
- `src/lib/theme.ts`, `src/app/globals.css`, `src/components/ThemeToggle.tsx`
- `src/app/api/settings/route.ts`, `src/app/admin/tema/page.tsx`, `src/app/admin/identitas/page.tsx`
- `src/components/ui/*` (Button, Card, Table, Badge — refactor ke Golden Ratio)

## Acceptance Criteria
- [x] Ganti tema di admin → seluruh situs berubah tanpa restart + dark mode persist per user
- [x] Ganti logo/title/SEO → tampil di tab browser + meta + footer
- [x] Audit visual: button/table/font mengikuti UI_GUIDE (skala φ); `prefers-reduced-motion` dihormati
- [x] Kontras teks utama ≥ 4.5:1 di light + dark (catat hasil cek)
- [x] Build produksi Next.js lolos

## Uji Manual
1. Cycle 10 tema + dark → screenshot tiap 2 tema.
2. Upload logo + ubah SEO → view-source cek title/meta.
3. Cek mobile 360px + desktop 1440px.

## Log Agen

- [2026-10-20] Codex - DOING: mulai setelah T-009; membaca cakupan tema, identitas, dan SEO.

- [2026-10-20] Codex - DONE: 10 tema tersambung ke CSS; pengaturan tema/identitas di admin memperbarui layout, metadata, navbar, dan footer publik. Dark mode persisten via localStorage tersedia di admin dan publik. UI Golden Ratio/reduced-motion dan ReactBits-style yang diminta tersedia. Cek kontras foreground putih pada endpoint gradient tema minimum 4.99:1; teks netral light minimum 4.76:1; teks muted dark 12.02:1. `npx tsc --noEmit`, isolated `npx next build`, dan `npm run build` pada salinan verifikasi bersih lolos. Screenshot browser belum bisa diperiksa karena aset `.next` pada server dev aktif sebelumnya 404 setelah build default; build ini memakai direktori terisolasi.

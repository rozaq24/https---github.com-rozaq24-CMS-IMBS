---
id: T-012
title: Halaman Publik Lengkap
status: TODO
priority: P1
phase: 4
domain: public
blueprint_ref:
  - blueprint/blueprint fitur front end.md#1
  - blueprint/blueprint fitur front end.md#2
  - blueprint/blueprint fitur front end.md#3
  - blueprint/blueprint fitur front end.md#4
  - blueprint/blueprint fitur front end.md#5
agent_suitability: [antigravity, copilot, codex]
depends_on: [T-003, T-004, T-005, T-006, T-008, T-010]
estimated: L
branch: feat/T-012-halaman-publik
---

# T-012 — Halaman Publik: Profil/Agenda/Download/FAQ/Pengaduan/E-Learning/Perpus

## Tujuan
Merakit seluruh halaman publik sesuai Blueprint Frontend #1–#5 dengan UI Golden Ratio + ReactBits.

## Scope IN
- Homepage: hero (GradientText) + sambutan + statistik (siswa/guru/prestasi) + berita terbaru (AnimatedList) + agenda + prestasi (SpotlightCard) + galeri preview + CTA SPMB + FAQ preview
- Rute: `/profil` (visi-misi+sejarah+sambutan), `/guru`, `/program`, `/prestasi`, `/berita`, `/agenda`, `/galeri`, `/download`, `/spmb`, `/faq` (akordeon interaktif + search), `/pengaduan` (reuse Message), `/e-learning` + `/perpustakaan` (kartu link/integrasi ringan + jam/buku unggulan)
- SEO per halaman (title/desc/OG), ISR, sitemap terupdate, breadcrumb, empty/error/loading states
- Mobile 360px + desktop 1440px rapi; `prefers-reduced-motion` aman

## Scope OUT
- LMS/perpus full system (cukup integrasi link + data dasar; full system = backlog).

## Files
- `src/app/(public)/*` semua rute di atas + `src/components/*` (Hero, Stats, FaqAccordion, Timeline, etc.)
- `src/app/sitemap.ts`, `src/app/robots.ts`

## Acceptance Criteria
- [ ] Semua rute di atas ada + terisi data mock/seed + tidak ada halaman 404 yang seharusnya ada
- [ ] Lighthouse performa/SEO/aksesibilitas ≥ 85 per halaman utama (catat skor di log)
- [ ] FAQ search jalan; form pengaduan masuk inbox (T-005)
- [ ] `npm run build` lolos tanpa warning route

## Uji Manual
1. Jelajahi semua rute (mobile + desktop) → screenshot homepage + 3 halaman.
2. Cari FAQ "beasiswa" → hasil relevan.
3. Kirim pengaduan dari /pengaduan → cek inbox.

## Log Agen
- (isi saat dikerjakan)

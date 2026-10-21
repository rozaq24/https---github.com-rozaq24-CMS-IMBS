---
id: T-012
title: Halaman Publik Lengkap
status: DONE
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
- [x] Semua rute di atas ada + terisi data demo/seed + tidak ada halaman 404 yang seharusnya ada
- [x] Lighthouse performa/SEO/aksesibilitas ≥ 85 per halaman utama (catat skor di log)
- [x] FAQ search jalan; form pengaduan masuk inbox (T-005)
- [x] `npm run build` lolos tanpa warning route

## Uji Manual
1. Jelajahi semua rute (mobile + desktop) → screenshot homepage + 3 halaman.
2. Cari FAQ "beasiswa" → hasil relevan.
3. Kirim pengaduan dari /pengaduan → cek inbox.

## Log Agen
- [2026-10-21] Codex - DONE: membandingkan homepage dengan cms.sekolahku.web.id; memperbarui hero, sambutan, statistik, program, guru, kartu berita, footer, dan navigasi responsif. Uiverse dipakai sebagai rujukan interaksi tombol/kartu CSS ringan tanpa dependency. `npx tsc --noEmit` dan `NEXT_DIST_DIR=.next-t012 npx next build` lolos; browser production 1440px/390px tanpa horizontal overflow, route /profil /berita /spmb HTTP 200, mobile menu menampilkan CTA SPMB. Lighthouse production (Performance/Accessibility/SEO): / 87/100/100, /profil 87/100/100, /berita 92/100/100, /spmb 98/100/100, /faq 96/100/100. Foto kepala sekolah dan kontak belum tersedia dalam identitas CMS sehingga UI tetap memakai monogram dan bar kontak hanya muncul bila datanya diisi.
- [2026-10-21] Codex - REVIEW: build Next.js production terisolasi (`NEXT_DIST_DIR=.next-t012 npx next build`) lolos; route table memuat seluruh route publik tanpa warning route. `npm run build` gagal di `prisma generate` dengan EPERM saat rename query engine DLL yang sedang dipakai dua server `next dev` aktif. Lighthouse production masih belum dapat diverifikasi: server yang tersedia hanya dev, sedangkan instruksi workspace melarang memulai server. Acceptance Lighthouse tetap terbuka; task dipertahankan REVIEW.
- [2026-10-20] Codex - DOING: mulai setelah T-011; meninjau blueprint, acceptance criteria, dan halaman publik yang sudah tersedia.

- [2026-10-20] Codex - REVIEW: semua halaman dan route publik, homepage sections, FAQ searchable, e-learning/perpustakaan ringan, breadcrumb, metadata, loading/error state, sitemap, dan robots selesai. `npx tsc --noEmit` dan `npm run build` pada salinan verifikasi bersih lolos; route table build memuat semua rute. Seed T-013 sudah dijalankan; QA browser/Lighthouse masih tertunda: server localhost timeout saat Playwright membuka halaman setelah direktori `.next` dipakai build default sebelumnya.
- [2026-10-20] Codex - REVIEW: 21 rute publik/SEO merespons HTTP 200; pencarian FAQ `beasiswa` memberi hasil relevan. Screenshot 360px/1440px untuk homepage, profil, berita, dan SPMB disimpan di `public/qa-screenshots/`. Pengaduan dan inbox lulus uji browser. Lighthouse pada dua server localhost mencatat homepage: port 3000 Performance 64, Accessibility 100, SEO 100; port 3001 Performance 48, Accessibility 100, SEO 91. Keduanya menyajikan bundle development; target Performance ≥85 pada production belum terverifikasi. Task tetap REVIEW.
- [2026-10-20] Codex - REVIEW: keyboard nav desktop untuk dropdown profil, menu mobile, pencarian FAQ, form pengaduan berlabel, serta fokus/trap modal galeri diperiksa via Playwright lokal; seluruh alur tersebut lulus setelah perbaikan fokus pada lightbox. Lighthouse production tetap belum memenuhi bukti acceptance.

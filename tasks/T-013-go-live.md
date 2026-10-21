---
id: T-013
title: Seed, QA, SEO, Aksesibilitas, Deploy
status: REVIEW
priority: P2
phase: 5
domain: infra
blueprint_ref:
  - blueprint/blueprint fitur admin.md#5
  - blueprint/blueprint fitur front end.md#5
agent_suitability: [codex, copilot]
depends_on: [T-001, T-002, T-003, T-004, T-005, T-006, T-007, T-008, T-009, T-010, T-011, T-012]
estimated: M
branch: feat/T-013-go-live
---

# T-013 — Seed, QA, SEO, Aksesibilitas, Deploy

## Tujuan
Go-live checklist: seed demo, QA lintas-role, SEO + a11y, panduan deploy SQLite→Postgres.

## Scope IN
- `prisma/seed.ts`: SUPERADMIN + operator/guru demo, 10 tema, menu awal 3 level, 8 post, pages (Visi-Misi/Sejarah/Kontak), greeting, 2 album, guru/siswa contoh, SPMB periode demo, FAQ, settings identitas/SEO
- QA matrix: 5 role × modul (uji 403/200), test import Excel 100 baris, SPMB end-to-end, backup/restore dev.db
- SEO/a11y: sitemap.xml, robots.txt, OG default, alt checker, kontras, keyboard nav, `npm run build` bersih
- `docs/DEPLOY.md`: Vercel/VM + Postgres `DATABASE_URL`, migrasi `prisma migrate deploy`, upload S3 next-step

## Scope OUT
- Fitur baru. Cukup polish + docs.

## Files
- `prisma/seed.ts`, `docs/DEPLOY.md`, `docs/QA_CHECKLIST.md`
- `src/app/sitemap.ts`, `src/app/robots.ts` (finalisasi)
- `.env.example` (final)

## Acceptance Criteria
- [x] `npx prisma db seed` sukses + login demo semua role jalan
- [ ] QA_CHECKLIST terisi ✅ semua (dengan nama penguji + tanggal)
- [ ] `npm run build` + `npx prisma validate` lolos; Lighthouse homepage ≥ 85
- [ ] DEPLOY.md bisa diikuti orang baru tanpa tanya (uji baca ulang)

## Uji Manual
1. Reset DB → seed → login tiap role → cek akses.
2. Ikuti DEPLOY.md ke environment staging.

## Log Agen
- [2026-10-21] Codex - REVIEW: dashboard disusun ulang mengikuti referensi CBT dengan sidebar aktif, navigasi modul, statistik dari Prisma, agenda, posting terbaru, aktivitas admin, serta akses cepat. Shell admin dipakai lintas halaman dan tetap responsif. `npx next build` pada direktori output terpisah lolos; status T-013 tetap REVIEW karena acceptance go-live lain masih terbuka.
- [2026-10-21] Codex - REVIEW: dashboard admin dirapikan dengan tiga kelompok menu, deskripsi singkat, identitas role, dan pintasan posting. `npx next build` pada direktori output terpisah lolos. `npm run build` terhenti pada `prisma generate` (`EPERM` saat mengganti query engine) karena file terkunci oleh server Node aktif di port 3000/3001; status T-013 tetap REVIEW.
- [2026-10-20] Codex - REVIEW: matriks API lima role pada delapan endpoint (users, settings, posts, pages, students, classes, SPMB, publik) cocok dengan hasil 200/403 yang diharapkan; 40/40 pemeriksaan lulus. Import XLSX melalui UI menghasilkan preview 95 valid + 5 error rinci, commit 95 baris sukses; semua siswa sintetis dibersihkan. QA checklist diperbarui; task tetap REVIEW karena skor Lighthouse production, audit aksesibilitas lengkap, dan staging belum terpenuhi.
- [2026-10-20] Codex - REVIEW: `npm run build` ulang pada salinan verifikasi terisolasi dengan source terbaru lolos (78 rute); `npx prisma validate` dan `npx tsc --noEmit` lolos. `npm run lint` belum tersedia karena proyek belum memiliki ESLint/config, sehingga TypeScript dipakai sebagai fallback sesuai AGENTS.
- [2026-10-20] Codex - REVIEW: seed idempoten, docs deploy/QA, sitemap/robots, alt audit, dan backup-restore SQLite selesai. Seed berhasil dijalankan dua kali; snapshot dan restore pada salinan menunjukkan 21 tabel cocok dan quick_check ok. `npx tsc --noEmit`, `npx prisma validate`, serta `npm run build` pada salinan verifikasi bersih (Next 14.2.35) lolos. `npm audit --omit=dev` masih menemukan 29 temuan; Next 14 dipertahankan sesuai AGENTS. Role login, QA end-to-end, screenshot, dan Lighthouse belum bisa dijalankan karena Playwright timeout ke server localhost yang aset `.next`-nya tidak utuh; task tetap REVIEW.
- [2026-10-20] Codex - REVIEW: seed utama berhasil dijalankan; kelima akun demo berhasil login. Uji akses yang dijalankan: OPERATOR_BERITA dapat membuka posting/inbox, OPERATOR_SPMB dapat membuka SPMB namun ditolak pada posting, GURU dan WALI_READONLY ditolak pada posting. Satu alur SPMB dengan berkas PDF valid menghasilkan 201 dan status dapat dicek; berkas ditolak tanpa login (401), data uji dan file dihapus. Backup/restore, schema validation, dan build bersih sebelumnya lolos. Screenshot tersimpan; Lighthouse belum memenuhi Performance ≥85 (64 pada port 3000, 48 pada 3001). Matriks akses lengkap, import 100 baris, audit Lighthouse per halaman, dan staging belum lulus; task tetap REVIEW.
- [2026-10-20] Codex - REVIEW: pembacaan ulang DEPLOY.md menemukan prasyarat Node 20 tidak sesuai dengan engine sanitize-html 2.18.1 (Node >=22.12); panduan lokal dan VM diperbarui ke Node 22.12+. Prosedur dibaca ulang, tetapi belum dijalankan pada staging; acceptance tetap terbuka.
- [2026-10-20] Codex - REVIEW: Playwright keyboard QA lokal lulus untuk nav desktop (dropdown dengan Enter), modal galeri (fokus masuk, Tab/Shift+Tab terperangkap, Escape menutup dan fokus kembali), menu mobile (Enter/Escape), pencarian FAQ beasiswa, serta label native lima field pengaduan. Ditemukan fokus modal sebelumnya tidak dipindahkan; perbaikan fokus/trap diterapkan di Masonry. Lighthouse production, sebagian alur QA lintas modul, dan staging tetap terbuka.
- [2026-10-20] Codex - REVIEW: setelah perbaikan Masonry, `npm run build` pada salinan verifikasi dengan dependensi lockfile Next.js 14.2.35 + Prisma Client generate lolos (78 rute); `npx tsc --noEmit` dan `npx prisma validate` pada workspace lolos. Install workspace sendiri masih 14.2.18; tidak disentuh karena server dev sedang memakai node_modules tersebut.
- [2026-10-20] Codex - REVIEW: Playwright keyboard QA lokal lulus untuk nav desktop (dropdown dengan Enter), modal galeri (fokus masuk, Tab/Shift+Tab terperangkap, Escape menutup dan fokus kembali), menu mobile (Enter/Escape), pencarian FAQ beasiswa, serta label native lima field pengaduan. Ditemukan fokus modal sebelumnya tidak dipindahkan; perbaikan fokus/trap diterapkan di Masonry. Lighthouse production, sebagian alur QA lintas modul, dan staging tetap terbuka.

---
id: T-013
title: Seed, QA, SEO, Aksesibilitas, Deploy
status: DOING
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
- [ ] `npx prisma db seed` sukses + login demo semua role jalan
- [ ] QA_CHECKLIST terisi ✅ semua (dengan nama penguji + tanggal)
- [ ] `npm run build` + `npx prisma validate` lolos; Lighthouse homepage ≥ 85
- [ ] DEPLOY.md bisa diikuti orang baru tanpa tanya (uji baca ulang)

## Uji Manual
1. Reset DB → seed → login tiap role → cek akses.
2. Ikuti DEPLOY.md ke environment staging.

## Log Agen
- [2026-10-20] Codex - DOING: mulai menyiapkan seed demo idempoten, QA checklist, SEO/a11y, dan panduan deploy sesuai T-013.

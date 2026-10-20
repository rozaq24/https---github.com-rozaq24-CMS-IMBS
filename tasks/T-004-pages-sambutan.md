---
id: T-004
title: Custom Pages + Kata Sambutan Kepsek
status: DONE
priority: P1
phase: 1
domain: admin/blog
blueprint_ref:
  - blueprint/blueprint fitur admin.md#1
  - blueprint/blueprint fitur front end.md#1
agent_suitability: [antigravity, copilot, codex]
depends_on: [T-001, T-003]
estimated: M
branch: feat/T-004-pages-sambutan
---

# T-004 — Custom Pages + Kata Sambutan Kepsek

## Tujuan
Halaman statis dinamis (Visi-Misi, Sejarah, Hubungi Kami) + Kata Sambutan + foto Kepsek yang bisa diedit admin.

## Scope IN
- CRUD CustomPage (slug, content TipTap, showInMenu, order) + render publik `/(public)/[slug]`
- Singleton Greeting (title, body, principalName, photo) + admin editor + tampil di homepage + `/profil` + `/sambutan`
- Validasi slug tidak bentrok dengan route reservasi (admin, api, berita, spmb, dll)

## Scope OUT
- Menu Builder (T-009). Galeri (T-005).

## Files
- `src/app/api/pages/route.ts`, `src/app/api/pages/[id]/route.ts`, `src/app/api/greeting/route.ts`
- `src/app/admin/pages/page.tsx`, `src/app/admin/sambutan/page.tsx`
- `src/app/(public)/[slug]/page.tsx`, `src/components/GreetingCard.tsx`

## Acceptance Criteria
- [x] Buat page "Visi-Misi" → tampil di `/visi-misi` dengan TipTap render + SEO title/desc
- [x] Edit sambutan + ganti foto → homepage + /profil berubah tanpa deploy ulang (ISR revalidate)
- [x] Slug reservasi ditolak dengan pesan jelas, termasuk slug otomatis dari judul
- [x] `npm run build` lolos

## Uji Manual
1. Buat page Sejarah → buka /sejarah.
2. Edit sambutan → cek homepage berubah < 1 menit.

## Log Agen
- [2026-10-20] Codex - DONE: source review found dynamic custom-page rendering with SEO metadata, Greeting on homepage/profil/sambutan with ISR 60s, and reserved-slug checks for manual/automatic slugs. Slug check, npx tsc --noEmit, npm run build passed. Browser QA not run: no active server and AGENTS forbids starting one.

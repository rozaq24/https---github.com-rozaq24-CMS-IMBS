---
id: T-003
title: Post CRUD + Editor Visual
status: DONE
priority: P0
phase: 1
domain: admin/blog
blueprint_ref:
  - blueprint/blueprint fitur admin.md#1
  - blueprint/blueprint fitur front end.md#2
agent_suitability: [codex, antigravity, copilot]
depends_on: [T-001, T-002]
estimated: L
branch: feat/T-003-post-crud
---

# T-003 — Post CRUD + Editor Visual (Berita/Pengumuman/Agenda/Artikel)

## Tujuan
Manajemen Posting penuh: tulis/edit/jadwal/hapus Berita, Pengumuman, Agenda, Artikel dengan editor visual (TipTap).

## Scope IN
- Model Post (slug unik, type, status, publishedAt, cover upload, views)
- API CRUD + slug auto + jadwal publish (SCHEDULED→PUBLISHED) + validasi Zod
- Admin UI: list (filter type/status/search), editor TipTap (bold/italic/H2/H3/list/link/image/quote), preview, schedule picker
- Publik: `/berita`, `/berita/[slug]` (render HTML aman, related, views+1), RSS/link sitemap parsial
- SystemLog untuk create/update/delete/publish

## Scope OUT
- Komentar (T-005). Custom Pages (T-004). Agenda kalender khusus (T-008 — reuse type AGENDA bila perlu).

## Files
- `src/app/api/posts/route.ts`, `src/app/api/posts/[id]/route.ts`, `src/app/api/upload/route.ts`
- `src/app/admin/posts/page.tsx`, `src/app/admin/posts/[id]/page.tsx`, `src/components/ui/Editor.tsx`
- `src/app/(public)/berita/page.tsx`, `src/app/(public)/berita/[slug]/page.tsx`
- `src/lib/validators.ts` (postSchema)

## Acceptance Criteria
- [x] Buat DRAFT → preview benar → schedule besok → status SCHEDULED → terbit otomatis (atau tombol Publish) → tampil di /berita
- [x] Slug duplikat ditolak/dibuatkan suffix unik; cover ter-upload ke /uploads
- [x] OPERATOR_BERITA bisa CRUD post; OPERATOR_SPMB tidak bisa (403)
- [x] Halaman publik ISR + aman dari XSS (sanitize render)
- [x] `npx prisma validate` + `npm run build` lolos

## Data / API Contract
```ts
POST /api/posts { title, type: BERITA|PENGUMUMAN|AGENDA|ARTIKEL, excerpt?, content, cover?, status: DRAFT|SCHEDULED|PUBLISHED, publishedAt? }
GET /api/posts?type=&status=&q=&page= → { data, total }
GET /berita/[slug] → ISR revalidate 60
```

## Uji Manual
1. Admin → Posts → Baru → isi + upload cover → Save DRAFT → Preview.
2. Schedule +1 hari → cek badge SCHEDULED → Publish manual → cek /berita.
3. Coba slug sama → pastikan unik.

## Log Agen
- [2026-10-20] Cline — DOING: helper posts (slugify/unique/cleanHtml) + API posts CRUD + upload cover + Editor TipTap + admin list/form + publik /berita + RSS.
- [2026-10-20] Cline — FIX: install ganda menimpa sanitize-html → kunci `sanitize-html@2.13.0`; cache .next korup (PageNotFound auth) → hapus .next + build ulang.
- [2026-10-20] Cline — DONE: `tsc --noEmit` ✅, `npm run build` ✅ 17 routes. Uji manual browser diserahkan ke user.

# Skema To-Do Lintas-Agent (tasks/_SCHEMA.md)

Semua file di `tasks/T-*.md` WAJIB ikut format ini agar bisa dibaca Codex, Antigravity, Copilot, Cline, dsb.

## Nama File

`T-<NOMOR>-<slug>.md` contoh: `T-003-post-crud.md`
Nomor 3 digit, urut. Slug lowercase + strip.

## Template Isi (copy-paste untuk task baru)

```markdown
---
id: T-003
title: Post CRUD + Editor Visual
status: TODO # TODO | DOING | BLOCKED | REVIEW | DONE
priority: P0 # P0=wajib-dulu, P1=penting, P2=nice-to-have
phase: 2 # lihat TODO_INDEX
domain: admin/blog # admin/blog, admin/akademik, admin/tampilan, admin/sistem, public, infra, ui
blueprint_ref:
  - blueprint/blueprint fitur admin.md#1
  - blueprint/blueprint fitur front end.md#2
agent_suitability: [codex, antigravity, copilot] # siapa cocok
depends_on: [T-001, T-002]
estimated: M # S <2jam, M 0.5-1 hari, L 2-3 hari
branch: feat/T-003-post-crud
---

# T-003 — Post CRUD + Editor Visual

## Tujuan
...

## Scope IN
- ...

## Scope OUT (jangan dikerjakan di sini)
- ...

## Files (wajib disentuh/dibuat)
- `prisma/schema.prisma` (model Post)
- `src/app/api/posts/route.ts`
- `src/app/admin/posts/page.tsx`
- ...

## Acceptance Criteria (checklist — semua harus ✅ untuk DONE)
- [ ] ...
- [ ] `npx prisma validate` lolos
- [ ] `npm run build` lolos

## Data / API Contract
```ts
// contoh
POST /api/posts { title, slug, type: BERITA|PENGUMUMAN|AGENDA|ARTIKEL, status, publishedAt }
```

## Uji Manual (langkah untuk user/QA)
1. ...
2. ...

## Log Agen (isi tiap agent yang mengerjakan)
- [2026-10-20] Codex — DOING: mulai scaffolding API...
- [2026-10-20] Copilot — DONE: build lolos, screenshot ...
```

## Status yang Sah

- `TODO`: belum dikerjakan, boleh diambil.
- `DOING`: sedang dikerjakan (tulis nama agent + tanggal).
- `BLOCKED`: tulis penyebab + butuh apa di Log Agen.
- `REVIEW`: kode jadi, butuh review user/agent lain.
- `DONE`: semua AC ✅ + bukti build/lint + log.

## Prioritas

- P0: fondasi (setup, auth, RBAC, Post, Menu, Tema). Kerjakan dulu.
- P1: akademik, SPMB, galeri, download, komentar.
- P2: polish UI ReactBits, SEO, e-library, FAQ animasi.

## Aturan Handoff

1. Jangan hapus Log Agen milik agent lain — tambah baris baru.
2. Kalau pindah agent (mis. Codex → Copilot), agent baru WAJIB baca Log Agen + git diff terakhir.
3. Kalau AC tidak jelas, tandai BLOCKED + tanya user, jangan ngarang.

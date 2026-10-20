---
id: T-001
title: Setup Fondasi Next.js + Prisma + Tailwind + Auth Skeleton
status: DONE
priority: P0
phase: 0
domain: infra
blueprint_ref:
  - blueprint/blueprint fitur admin.md#5
agent_suitability: [codex, antigravity, copilot]
depends_on: []
estimated: L
branch: feat/T-001-setup-fondasi
---

# T-001 — Setup Fondasi Next.js + Prisma + Tailwind + Auth Skeleton

## Tujuan
Menyiapkan fondasi repo agar semua agent bisa langsung coding fitur tanpa setup ulang: Next.js 14 + TS + Tailwind + Prisma + NextAuth skeleton + layout publik/admin + globals.css Golden Ratio.

## Scope IN
- `package.json` (next 14, react 18, prisma, next-auth, tailwind, zod, xlsx, bcryptjs, tiptap)
- `prisma/schema.prisma` lengkap (lihat docs/DATA_MODEL.md)
- `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/theme.ts`, `src/lib/validators.ts`
- `src/app/layout.tsx`, `globals.css` (Golden Ratio + 10 tema + dark), `(public)/page.tsx`, `admin/page.tsx`, `api/health/route.ts`
- `.env.example`, `README.md`, `middleware.ts` guard /admin
- `npm install + npx prisma validate`

## Scope OUT
- CRUD penuh (itu T-003 dst). Auth login UI penuh (itu T-002).

## Files
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`
- `prisma/schema.prisma`, `.env.example`
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(public)/page.tsx`, `src/app/admin/page.tsx`
- `src/lib/*`, `src/components/ui/*`, `middleware.ts`

## Acceptance Criteria
- [x] `npm install` sukses, `npx prisma validate` lolos
- [x] `npm run dev` tampil homepage + `/admin` (guard redirect bila belum login)
- [x] `GET /api/health` return `{ ok: true }`
- [x] globals.css memuat `--ratio: 1.618`, 10 `data-theme`, `.dark`
- [x] README menjelaskan cara lanjut via AGENTS.md

## Uji Manual
1. `npm install && npx prisma db push && npm run dev`
2. Buka `/` (homepage sekolah mock) dan `/admin` (redirect login / dashboard skeleton)
3. `GET /api/health`

## Log Agen
- [2026-10-20] Cline — DOING: membuat AGENTS.md, tasks schema, docs, prompts, + scaffold T-001 (package.json, prisma, layout, theme).
- [2026-10-20] Cline — DONE: user verifikasi `.env` + `dev.db` + `node_modules` ada (install + db push sukses). Scaffold T-001 ditutup, lanjut T-002.


# T-001 — Setup Fondasi Next.js + Prisma + Tailwind + Auth Skeleton

## Tujuan
Menyiapkan fondasi repo agar semua agent bisa langsung coding fitur tanpa setup ulang: Next.js 14 + TS + Tailwind + Prisma + NextAuth skeleton + layout publik/admin + globals.css Golden Ratio.

## Scope IN
- `package.json` (next 14, react 18, prisma, next-auth, tailwind, zod, xlsx, bcryptjs, tiptap)
- `prisma/schema.prisma` lengkap (lihat docs/DATA_MODEL.md)
- `src/lib/db.ts`, `src/lib/auth.ts`, `src/lib/theme.ts`, `src/lib/validators.ts`
- `src/app/layout.tsx`, `globals.css` (Golden Ratio + 10 tema + dark), `(public)/page.tsx`, `admin/page.tsx`, `api/health/route.ts`
- `.env.example`, `README.md`, `middleware.ts` guard /admin
- `npm install + npx prisma validate`

## Scope OUT
- CRUD penuh (itu T-003 dst). Auth login UI penuh (itu T-002).

## Files
- `package.json`, `tsconfig.json`, `tailwind.config.ts`, `next.config.mjs`
- `prisma/schema.prisma`, `.env.example`
- `src/app/layout.tsx`, `src/app/globals.css`, `src/app/(public)/page.tsx`, `src/app/admin/page.tsx`
- `src/lib/*`, `src/components/ui/*`, `middleware.ts`

## Acceptance Criteria
- [ ] `npm install` sukses, `npx prisma validate` lolos
- [ ] `npm run dev` tampil homepage + `/admin` (guard redirect bila belum login)
- [ ] `GET /api/health` return `{ ok: true }`
- [ ] globals.css memuat `--ratio: 1.618`, 10 `data-theme`, `.dark`
- [ ] README menjelaskan cara lanjut via AGENTS.md

## Uji Manual
1. `npm install && npx prisma db push && npm run dev`
2. Buka `/` (homepage sekolah mock) dan `/admin` (redirect login / dashboard skeleton)
3. `GET /api/health`

## Log Agen
- [2026-10-20] Cline — DOING: membuat AGENTS.md, tasks schema, docs, prompts, + scaffold T-001 (package.json, prisma, layout, theme).

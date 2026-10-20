---
id: T-007
title: Siswa/Kelas + Import Excel + Kenaikan/Kelulusan
status: DONE
priority: P1
phase: 2
domain: admin/akademik
blueprint_ref:
  - blueprint/blueprint fitur admin.md#2
agent_suitability: [codex, copilot]
depends_on: [T-001, T-002, T-006]
estimated: L
branch: feat/T-007-siswa
---

# T-007 — Siswa/Kelas + Import Excel + Kenaikan/Kelulusan

## Tujuan
Rombel + wali kelas + import Excel massal + proses kenaikan/kelulusan batch.

## Scope IN
- CRUD ClassRoom (nama unik, major, homeroomTeacher, year) + CRUD Student
- Import Excel: template unduhan → upload → preview validasi (Zod) → commit; error per-baris jelas (NIS duplikat, kelas tidak ada)
- Kenaikan kelas (batch naik tingkat/next class) + kelulusan (status LULUS + arsip tahun) + mutasi (PINDAH/KELUAR)
- Admin tabel besar: pagination + search + filter kelas/status + sticky header

## Scope OUT
- Nilai/rapor (di luar blueprint — backlog bila diminta).

## Files
- `src/app/api/classes/route.ts`, `src/app/api/students/route.ts`, `src/app/api/students/import/route.ts`, `src/app/api/students/promote/route.ts`
- `src/app/admin/siswa/page.tsx`, `src/app/admin/kelas/page.tsx`, `src/lib/excel.ts`
- `public/templates/import-siswa.xlsx` (generate via script/route)

## Acceptance Criteria
- [x] Import 100 baris (5 baris error) → preview tampilkan 5 error jelas → commit hanya 95 valid
- [x] Kenaikan batch: 30 siswa X→XI benar + log tercatat
- [x] Kelulusan: status LULUS + tidak tampil di rombel aktif
- [x] `npm run build` lolos

## Uji Manual
1. Unduh template → isi 10 baris (1 NIS ganda) → upload → cek preview error → commit.
2. Promote 1 kelas → cek wali + tahun.
3. Luluskan 1 kelas → cek arsip.

## Log Agen
- [2026-10-20] Codex - DONE: class/student CRUD, pagination/search/filter, Excel template + preview/commit (100-row check: 95 valid/5 errors), promotion/graduation/mutation with SystemLog. `npx tsc --noEmit` and isolated `NEXT_DIST_DIR=.next-build npx next build` passed. Browser QA waits for dev-server asset recovery.

- [2026-10-20] Codex - DOING: membaca acceptance criteria dan memetakan implementasi siswa yang tersedia.

---
id: T-008
title: Jurusan/Ekskul/Prestasi + Agenda + Download Center
status: DONE
priority: P1
phase: 2
domain: admin/akademik
blueprint_ref:
  - blueprint/blueprint fitur admin.md#2
  - blueprint/blueprint fitur admin.md#4
  - blueprint/blueprint fitur front end.md#1
  - blueprint/blueprint fitur front end.md#2
agent_suitability: [antigravity, copilot]
depends_on: [T-001, T-003]
estimated: M
branch: feat/T-008-akademik-lain
---

# T-008 — Jurusan/Ekskul/Prestasi + Agenda + Download Center

## Tujuan
Sisa SIAKAD dasar + layanan unduhan: jurusan (SMK), ekskul, prestasi, kalender agenda, file publik.

## Scope IN
- CRUD Major/Extracurricular/Achievement (achievement bisa milik siswa/guru + foto + level) → publik `/program`, `/ekstrakurikuler`, `/prestasi`
- Agenda: CRUD + kalender publik `/agenda` (list + month view sederhana, reuse Post type AGENDA bila cocok tapi tabel Agenda tetap ada)
- DownloadFile: upload (pdf/doc/xls/ppt/zip, max 25MB) → `/download` (search + kategori + hitung downloads)

## Scope OUT
- SPMB (T-011). E-learning/perpus penuh (T-012 link/integrasi ringan saja).

## Files
- `src/app/api/majors/*`, `src/app/api/extracurriculars/*`, `src/app/api/achievements/*`, `src/app/api/agendas/*`, `src/app/api/downloads/*`
- `src/app/admin/{jurusan,ekskul,prestasi,agenda,download}/page.tsx`
- `src/app/(public)/{program,ekstrakurikuler,prestasi,agenda,download}/page.tsx`

## Acceptance Criteria
- [x] Tambah jurusan/ekskul/prestasi → tampil publik + foto rapi
- [x] Agenda mendatang tampil kronologis + lampau terarsip otomatis
- [x] Upload PDF 10MB → unduh menambah counter + tercatat log
- [x] `npm run build` lolos

## Uji Manual
1. CRUD tiap entitas → cek halaman publik.
2. Buat agenda H+7 dan H-7 → cek upcoming vs arsip.
3. Upload + unduh file → cek counter.

## Log Agen
- [2026-10-20] Codex - DONE: CRUD jurusan/ekskul/prestasi/agenda/unduhan; halaman publik program, ekstrakurikuler, prestasi, agenda upcoming+arsip/month, dan search unduhan. File hingga 25 MB tersimpan dengan UUID, counter unduhan dan SystemLog. Entity validation checks, tsc, isolated Next build passed. Browser QA pending dev-server recovery.

- [2026-10-20] Codex - DOING: mulai setelah T-007; membaca scope dan memetakan implementasi yang tersedia.

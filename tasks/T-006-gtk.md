---
id: T-006
title: GTK/Guru + Direktori Publik
status: DOING
priority: P1
phase: 2
domain: admin/akademik
blueprint_ref:
  - blueprint/blueprint fitur admin.md#2
  - blueprint/blueprint fitur front end.md#1
agent_suitability: [codex, copilot]
depends_on: [T-001, T-002]
estimated: M
branch: feat/T-006-gtk
---

# T-006 — GTK/Guru + Direktori Publik

## Tujuan
Kelola biodata Guru & Tendik (jabatan, pangkat/golongan, foto) + direktori publik yang rapi.

## Scope IN
- CRUD Teacher (NIP unik, jabatan, pangkat, pendidikan, pengalaman, mapel, foto, active)
- Publik `/guru` (search + filter jabatan + SpotlightCard ReactBits-style) + `/guru/[id]` profil detail
- Wali kelas: relasi opsional ke ClassRoom (diisi penuh di T-007, tapi field sudah ada)

## Scope OUT
- Siswa/kelas penuh (T-007).

## Files
- `src/app/api/teachers/route.ts`, `src/app/api/teachers/[id]/route.ts`
- `src/app/admin/gtk/page.tsx`
- `src/app/(public)/guru/page.tsx`, `src/app/(public)/guru/[id]/page.tsx`

## Acceptance Criteria
- [ ] Tambah guru + foto → tampil di /guru < 1 menit; nonaktifkan → hilang dari publik tapi tetap di admin
- [ ] NIP duplikat ditolak; search nama/jabatan jalan
- [ ] `npm run build` lolos

## Uji Manual
1. Tambah 3 guru → cek /guru + detail.
2. Nonaktifkan 1 → cek hilang dari publik.

## Log Agen
- (isi saat dikerjakan)

- [2026-10-20] Codex - DOING: membaca scope dan memetakan kode yang ada.

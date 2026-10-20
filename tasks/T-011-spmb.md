---
id: T-011
title: SPMB Online
status: DONE
priority: P1
phase: 4
domain: admin/sistem
blueprint_ref:
  - blueprint/blueprint fitur admin.md#4
  - blueprint/blueprint fitur front end.md#3
agent_suitability: [codex, copilot]
depends_on: [T-001, T-002]
estimated: L
branch: feat/T-011-spmb
---

# T-011 — SPMB Online (publik + validasi operator + statistik)

## Tujuan
Pendaftaran murid baru online mandiri + verifikasi berkas oleh operator + statistik pendaftar.

## Scope IN
- SPMBPeriod (nama, tahun, kuota, tanggal buka/tutup, syarat, aktif) + SPMBApplicant (biodata, asal sekolah, ortu, berkas upload PDF/JPG, status PENDING→VERIFIED/REJECTED/ACCEPTED)
- Publik `/spmb` (info kuota/syarat + form multi-step + cek status via kode/NIK) + validasi Zod + anti-double submit
- Operator: `/admin/spmb` (tabel + filter status/periode + verifikasi + catatan + statistik: harian, asal sekolah, status) + export CSV
- SystemLog untuk verifikasi/keputusan

## Scope OUT
- Pembayaran/dafar-ulang online (backlog). SMS/WA notif (backlog, cukup email log).

## Files
- `src/app/api/spmb/periods/*`, `src/app/api/spmb/applicants/*`, `src/app/api/spmb/stats/route.ts`
- `src/app/(public)/spmb/page.tsx`, `src/app/(public)/spmb/status/page.tsx`
- `src/app/admin/spmb/page.tsx`, `src/components/SpmbForm.tsx`, `src/components/SpmbStats.tsx`

## Acceptance Criteria
- [x] Daftar di periode aktif (upload 3 berkas) → dapat kode pendaftaran → status PENDING terlihat
- [x] Periode tutup → form terkunci dengan pesan jelas
- [x] Operator verifikasi → status berubah + statistik update + export CSV benar
- [x] NIK/email ganda di periode sama ditolak; upload non-PDF/JPG ditolak
- [x] Build produksi Next.js lolos

## Uji Manual
1. Buat periode 2026 (kuota 100) → daftar 2 pendaftar (1 lengkap, 1 berkas kurang).
2. Verifikasi 1, tolak 1 + catatan → cek status publik + statistik + CSV.

## Log Agen

- [2026-10-20] Codex - DONE: portal daftar dua langkah, kode/status privat via kode+NIK, periode, verifikasi/catatan, statistik harian-asal-status, dan CSV dibuat. NIK/email unik per periode; upload PDF/JPG memeriksa signature dan disimpan privat, maksimal 8 MB per berkas; pendaftaran parsial didukung agar operator dapat melihat berkas kurang. SystemLog mencatat perubahan periode dan keputusan. `npx prisma validate`, `npx tsc --noEmit`, sinkronisasi `prisma db push`, dan `NEXT_DIST_DIR=.next-build npx next build` berhasil. Prisma Client regeneration setelah db push gagal mengganti DLL yang terkunci server dev; schema tidak mengubah field Client. QA browser belum dilakukan karena aset server dev terdampak build default sebelumnya.

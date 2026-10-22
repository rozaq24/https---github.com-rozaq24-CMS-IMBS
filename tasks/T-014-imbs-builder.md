---
id: T-014
title: IMBS Builder Halaman Statis
status: DOING
priority: P1
phase: 6
domain: admin/tampilan
blueprint_ref:
  - AGENTS.md#Echo-UI
  - tasks/T-004-pages-sambutan.md
agent_suitability: [codex, antigravity, copilot]
depends_on: [T-001, T-002, T-004]
estimated: L
branch: feat/T-014-imbs-builder
---

# T-014 — IMBS Builder Halaman Statis

## Tujuan
Menambahkan editor visual untuk membuat halaman statis memakai kanvas posisi bebas, lalu menyimpan dan menampilkannya melalui sistem CustomPage.

## Scope IN
- Tambahkan item sidebar `IMBS BUILDER` yang mengarah ke editor dan batasi akses sesuai role halaman statis (`SUPERADMIN`, `OPERATOR_BERITA`).
- Kanvas desktop dengan koordinat bebas, tambah/pilih/pindah/hapus elemen, properti dasar, penggaris, gridlines, dan snap ke tepi/titik tengah elemen.
- Palette awal elemen teks, judul, tombol, garis, dan bentuk sederhana. Tautkan katalog Shadcn dan ReactBits sebagai sumber untuk perluasan komponen.
- Simpan metadata halaman dan serialisasi kanvas pada CustomPage; pertahankan dukungan konten HTML halaman lama.
- Render layout tersimpan pada route publik CustomPage.
- Gunakan komponen Echo untuk kontrol yang tersedia dan token Echo untuk UI builder.

## Scope OUT
- Menyalin seluruh katalog, aset, atau implementasi pihak ketiga secara otomatis.
- Mengubah stack atau memindahkan data CustomPage lama.
- Fitur AI, kolaborasi realtime, versioning, breakpoint responsif per elemen, dan ekspor kode.

## Files
- `tasks/TODO_INDEX.md`, `tasks/T-014-imbs-builder.md`
- `prisma/schema.prisma`
- `src/lib/validators.ts`
- `src/app/admin/admin-shell.tsx`
- `src/app/admin/builder/*`
- `src/app/api/pages/route.ts`, `src/app/api/pages/[id]/route.ts`
- `src/app/(public)/[slug]/page.tsx`

## Acceptance Criteria
- [ ] Sidebar menampilkan `IMBS BUILDER` dan akses halaman serta API menolak role selain `SUPERADMIN`/`OPERATOR_BERITA`.
- [ ] Admin dapat menambah elemen, memilihnya, memindahkannya pada kanvas bebas, mengubah properti dasar, serta menghapusnya.
- [ ] Penggaris/gridlines dapat dibaca dan snap guides membantu meluruskan objek.
- [ ] Halaman builder tersimpan sebagai CustomPage dan dapat dibuka kembali dengan posisi elemen yang sama.
- [ ] Halaman terbit merender elemen builder; halaman HTML lama tetap dirender seperti sebelumnya.
- [ ] `npm run prisma:generate`, `npm run prisma:validate`, `npx tsc --noEmit`, dan build terisolasi lolos.

## Uji Manual
1. Login sebagai OPERATOR_BERITA, buka IMBS BUILDER, buat halaman dengan teks/tombol/bentuk, pindah dan snap elemen, simpan.
2. Muat ulang editor dan pastikan koordinat/properti tetap sama.
3. Buka slug publik dan bandingkan dengan pratinjau kanvas.
4. Uji role OPERATOR_SPMB, GURU, dan WALI_READONLY mendapat 403.

## Log Agen
- [2026-10-22] Codex — DOING: memulai implementasi editor kanvas bebas dengan penyimpanan serialisasi pada CustomPage.

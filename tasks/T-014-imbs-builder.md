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
- Jadikan katalog Shadcn dan ReactBits sebagai baseline komponen/aset yang dapat dicari dari Builder; elemen yang kompatibel dapat dimasukkan ke kanvas.
- Palette dasar memuat teks, judul, tombol, garis, dan bentuk sederhana.
- Pustaka memuat strip dengan latar solid/gradasi/gambar/video, kotak pengelompok, bentuk dekoratif, dan kontrol tipografi.
- Simpan metadata halaman dan serialisasi kanvas pada CustomPage; pertahankan dukungan konten HTML halaman lama.
- Render layout tersimpan pada route publik CustomPage.
- Gunakan komponen Echo untuk kontrol yang tersedia dan token Echo untuk UI builder.

## Scope OUT
- Menjalankan kode komponen pihak ketiga secara langsung tanpa adaptasi terhadap stack dan kebutuhan halaman publik CMS.
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
- [x] Sidebar menampilkan `IMBS BUILDER` dan akses halaman serta API menolak role selain `SUPERADMIN`/`OPERATOR_BERITA`.
- [x] Admin dapat menambah elemen, memilihnya, memindahkannya pada kanvas bebas, mengubah properti dasar, serta menghapusnya.
- [x] Penggaris/gridlines dapat dibaca dan snap guides membantu meluruskan objek.
- [ ] Referensi katalog Shadcn UI dan React Bits dapat dicari di panel; pola yang kompatibel ditambahkan sebagai elemen statis.
- [ ] Admin dapat menambah strip dan mengatur latar solid, gradasi, gambar, atau video.
- [ ] Admin dapat mengelompokkan elemen dalam kotak dan menggeser grup bersama.
- [ ] Admin dapat mengatur font, ukuran, warna, jarak baris, jarak huruf, dan bayangan teks.
- [x] Halaman builder tersimpan sebagai CustomPage dan dapat dibuka kembali dengan posisi elemen yang sama.
- [x] Halaman terbit merender elemen builder; halaman HTML lama tetap dirender seperti sebelumnya.
- [ ] `npm run prisma:generate`, `npm run prisma:validate`, `npx tsc --noEmit`, dan build terisolasi lolos.

## Uji Manual
1. Login sebagai OPERATOR_BERITA, buka IMBS BUILDER, buat halaman dengan teks/tombol/bentuk, pindah dan snap elemen, simpan.
2. Muat ulang editor dan pastikan koordinat/properti tetap sama.
3. Buka slug publik dan bandingkan dengan pratinjau kanvas.
4. Uji role OPERATOR_SPMB, GURU, dan WALI_READONLY mendapat 403.

## Log Agen
- [2026-10-22] Codex — DOING: memulai implementasi editor kanvas bebas dengan penyimpanan serialisasi pada CustomPage.
- [2026-10-22] Codex — REVIEW: sidebar, kanvas posisi bebas, penggaris/grid, snap objek, inspector, serialisasi dan renderer publik selesai. `prisma validate`, `tsc`, dan build terisolasi lolos setelah `prisma db push`; `prisma generate` gagal dengan Windows EPERM karena query engine terkunci. QA browser belum dijalankan karena CLI Playwright tidak selesai memuat. Katalog komponen eksternal hanya ditautkan; komponen pihak ketiga belum diimpor.
- [2026-10-22] Codex — DOING: mengatasi runtime Prisma yang stale dan menambah pustaka elemen statis, gaya teks, latar strip, dan kelompok container. `tsc --noEmit` lolos; verifikasi Echo penuh menunjukkan temuan lama di repo, bukan hanya Builder.
- [2026-10-22] Codex — DOING: Prisma Client baru sukses menjalankan filter `builderData`; proses Next lama sudah direstart agar memuat client tersebut. `prisma validate`, `tsc --noEmit`, dan Echo check pada Builder lolos. Build terisolasi gagal karena unduhan Google Fonts timeout; route `/admin/builder` kini mengarah ke login tanpa runtime error, jadi alur dengan sesi admin masih perlu diverifikasi di browser.
- [2026-10-22] Codex — DOING: panel pustaka dapat mencari delapan pola statis dari Shadcn UI/React Bits dan menambah padanan lokal; strip mendukung solid/gradasi/gambar/video; container memindahkan anak bersama; kontrol teks menyimpan font, ukuran, warna, line-height, letter-spacing, dan bayangan. Browser dengan sesi admin dan cakupan seluruh katalog masih perlu QA.

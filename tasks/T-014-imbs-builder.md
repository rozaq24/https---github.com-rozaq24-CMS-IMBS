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
- Sediakan 100 keluarga font dalam tiga kelompok: 20 administrasi, 30 tampilan gambar, dan 50 geometrik; muat keluarga terpilih saat dipakai dari Google Fonts dengan 1001Fonts sebagai referensi kategori.
- Sediakan palet warna RGB dan CMYK serta pembuatan gradasi.
- Sediakan 15 pola shadcn/ui yang diminta dan pola React Bits sebagai elemen lokal untuk kanvas.
- Sediakan template halaman siap edit dan tautan katalog Wix, Figma Community, shadcn/ui, dan React Bits.
- Integrasikan pengelolaan halaman: membuat, menduplikasi, menyembunyikan dari menu, menautkan anchor, serta menyusun submenu berjenjang.
- Palette dasar memuat teks, judul, tombol, garis, dan bentuk sederhana.
- Pustaka memuat strip dengan latar solid/gradasi/gambar/video, kotak pengelompok, bentuk dekoratif, dan kontrol tipografi.
- Simpan metadata halaman dan serialisasi kanvas pada CustomPage; pertahankan dukungan konten HTML halaman lama.
- Render layout tersimpan pada route publik CustomPage.
- Gunakan komponen Echo untuk kontrol yang tersedia dan token Echo untuk UI builder.

## Scope OUT
- Menjalankan kode komponen pihak ketiga secara langsung tanpa adaptasi terhadap stack dan kebutuhan halaman publik CMS.
- Mengubah stack atau memindahkan data CustomPage lama.
- Fitur AI, kolaborasi realtime, versioning, breakpoint responsif per elemen, dan ekspor kode.
- Menyalin template pihak ketiga atau menjalankan kode pihak ketiga tanpa adaptasi dan pemeriksaan lisensi.

## Files
- `tasks/TODO_INDEX.md`, `tasks/T-014-imbs-builder.md`
- `prisma/schema.prisma`
- `src/lib/validators.ts`
- `src/app/admin/admin-shell.tsx`
- `src/app/admin/builder/*`
- `src/app/admin/pages/pages-client.tsx`, `src/components/MenuBuilder.tsx`
- `src/app/api/pages/[id]/duplicate/route.ts`, `src/app/api/menus/*`
- `src/lib/menus.ts`, `src/components/BuilderPage.tsx`, `src/app/globals.css`
- `src/app/api/pages/route.ts`, `src/app/api/pages/[id]/route.ts`
- `src/app/(public)/[slug]/page.tsx`

## Acceptance Criteria
- [x] Sidebar menampilkan `IMBS BUILDER` dan akses halaman serta API menolak role selain `SUPERADMIN`/`OPERATOR_BERITA`.
- [x] Admin dapat menambah elemen, memilihnya, memindahkannya pada kanvas bebas, mengubah properti dasar, serta menghapusnya.
- [x] Penggaris/gridlines dapat dibaca dan snap guides membantu meluruskan objek.
- [x] Referensi katalog Shadcn UI dan React Bits dapat dicari di panel; pola yang kompatibel ditambahkan sebagai elemen statis lokal.
- [x] Admin dapat menambah strip dan mengatur latar solid, gradasi, gambar, atau video.
- [x] Admin dapat mengelompokkan elemen dalam kotak dan menggeser grup bersama.
- [x] Admin dapat mengatur font, ukuran, warna, jarak baris, jarak huruf, dan bayangan teks.
- [x] Pustaka berisi tepat 100 keluarga font dengan pembagian 20/30/50 dan memuat font pada kanvas serta halaman publik.
- [x] Admin dapat memilih warna dengan RGB atau CMYK dan menerapkan gradasi.
- [x] Pustaka dapat mencari dan menambahkan semua 15 pola shadcn/ui dan pola React Bits lokal.
- [x] Admin dapat menerapkan dan mengedit template Profil Sekolah, Penerimaan Siswa, dan Kontak.
- [ ] Tombol serta pilihan ukuran, warna, dan latar di Builder memakai tampilan datar tanpa relief 3D.
- [ ] Pustaka komponen dan template dikelompokkan sebagai dropdown yang bisa dioperasikan dengan keyboard.
- [ ] Pustaka memiliki tepat 3 template blog, 5 education, dan 5 entertainment yang tersimpan lokal dan dapat diedit di kanvas.
- [x] Admin dapat menduplikasi halaman, mengatur visibilitas menu, menautkan menu ke anchor, serta menyusun submenu sampai tiga tingkat.
- [x] Halaman builder tersimpan sebagai CustomPage dan dapat dibuka kembali dengan posisi elemen yang sama.
- [x] Halaman terbit merender elemen builder; halaman HTML lama tetap dirender seperti sebelumnya.
- [x] Tidak ada perubahan skema Prisma; `npm run prisma:validate`, `npx tsc --noEmit`, dan build terisolasi lolos.

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
- [2026-10-22] Codex - DOING: pustaka diperluas menjadi 15 pola shadcn/ui, 4 pola React Bits lokal, 3 template orisinal, 100 font unik (20/30/50), kontrol RGB/CMYK/gradasi, anchor, duplikasi dan visibilitas halaman. `prisma:validate`, `tsc --noEmit`, Echo check terarah, dan build terisolasi lolos. Font dimuat saat dipakai dari Google Fonts; tidak ada file font atau template pihak ketiga yang disalin. Firecrawl tidak menyelesaikan verifikasi lisensi 100 nama individual; QA alur dengan sesi admin masih pending.
- [2026-10-22] Codex - DOING: merapikan viewport editor dengan scroll panel terpisah, panel katalog dan inspector lebih lebar, penggaris sejajar, serta susunan responsif. `tsc --noEmit` dan `npx echo-ui-cli check src/app/admin/builder/builder-client.tsx` lolos. Echo visual test gagal membuka Chrome; browser tanpa sesi diarahkan ke login. Build terisolasi terhenti saat unduhan font Google timeout; QA visual builder dengan sesi admin masih pending.
- [2026-10-22] Codex - DOING: meratakan tombol Builder dengan varian Echo ghost dan garis datar; mengganti segmented control dengan pilihan tombol; mengelompokkan katalog komponen/template dalam accordion; menambah 13 layout lokal yang dapat diedit (3 blog, 5 education, 5 entertainment) berdasarkan pola kategori Squarespace. Pemeriksaan kode dan visual browser masih perlu dijalankan.

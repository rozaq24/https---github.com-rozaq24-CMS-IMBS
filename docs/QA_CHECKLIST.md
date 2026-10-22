# QA Checklist CMS IMBS

Catat nama penguji, tanggal, browser/perangkat, bukti, dan hasil aktual sebelum mengubah status menjadi selesai. Jangan tandai uji yang belum dijalankan.

## Build dan schema

| Pemeriksaan | Status | Bukti |
|---|---|---|
| `npx prisma validate` | ✅ | Codex, 20 Oktober 2026, schema valid |
| `npx prisma db seed` | ✅ | Codex, 20 Oktober 2026, berhasil dua kali tanpa duplikasi demo |
| `npx tsc --noEmit` | ✅ | Codex, 20 Oktober 2026, lolos |
| Build produksi Next.js terisolasi | ✅ | Codex, 20 Oktober 2026, `NEXT_DIST_DIR=.next-build npx next build` lolos |
| `npm run build` (termasuk Prisma Client generate) | ✅ | Codex, 20 Oktober 2026, build produksi pada salinan verifikasi terisolasi dengan source terbaru; 78 rute terbangun. Build langsung di workspace tidak dapat mengganti query engine DLL yang dikunci server lokal. |

## Matriks akses role

`200` berarti akses diharapkan diberikan; `403` berarti ditolak; `—` berarti modul publik. Jalankan melalui browser/API dengan lima akun demo sebelum go-live.

| Role | Users/settings | Berita/pages | Siswa/kelas | SPMB | Baca konten publik |
|---|---:|---:|---:|---:|---:|
| SUPERADMIN | 200 | 200 | 200 | 200 | 200 |
| OPERATOR_BERITA | 403 | 200 | 403 | 403 | 200 |
| OPERATOR_SPMB | 403 | 403 | 200 | 200 | 200 |
| GURU | 403 | 403 | 403 | 403 | 200 |
| WALI_READONLY | 403 | 403 | 403 | 403 | 200 |

Status runtime: Codex, 20 Oktober 2026, server dev `http://localhost:3000`. Matriks diuji pada API dengan cookie sesi lima akun; hasil 403/200 sesuai tabel untuk users/settings, posts/pages, students/classes, SPMB, dan konten publik.

## Alur fitur

- [x] Login/logout untuk lima role; matriks API delapan endpoint selesai. Codex, Playwright/Fetch, 20 Oktober 2026; semua pasangan akses sesuai tabel (40 pemeriksaan, 0 gagal).
- [ ] Admin: tambah/edit publikasi, halaman, guru, siswa, menu, dan pengaturan.
- [x] Import XLSX 100 baris: preview 95 valid/5 invalid dengan penyebab per baris; commit mengimpor 95 valid. Codex, Playwright, 20 Oktober 2026; 95 siswa sintetis dihapus setelah uji.
- [ ] SPMB: periode aktif/tutup, daftar lengkap dan parsial, file PDF/JPG valid, file MIME/payload palsu ditolak, duplikat NIK/email ditolak, kode+NIK cek status, keputusan operator, statistik, dan CSV.
- [x] Pengaduan masuk ke inbox; komentar menunggu moderasi, disetujui, dan dihapus. Codex, Playwright, 20 Oktober 2026; seluruh record uji dibersihkan.
- [x] Galeri: unggah lima foto, filter kategori, buka lightbox, tutup dengan Escape. Codex, Playwright, 20 Oktober 2026; album dan berkas sintetis dibersihkan.
- [x] 360px dan 1440px: screenshot homepage, berita, profil, dan SPMB tersimpan di `public/qa-screenshots/`. FAQ, galeri, form, menu mobile, dark mode belum seluruhnya diuji manual.
- [x] FAQ pencarian `beasiswa` memberi hasil relevan (Codex, Playwright, 20 Oktober 2026).
- [x] Upload PDF SPMB valid diterima; status pendaftar dapat dicek; endpoint berkas memberi 401 tanpa login. Operator SPMB melihat pendaftar; respons unduh berkas sebagai role belum diverifikasi.
- [x] 21 rute publik/SEO diuji lewat HTTP; semuanya memberi 200 (Codex, 20 Oktober 2026).
- [x] SPMB uji sintetis berhasil (201 + pemeriksaan status 200), lalu record dan file QA dihapus.
- [x] Backup SQLite, restore ke salinan terpisah, 21 tabel dan row count cocok, `PRAGMA quick_check` = `ok` (Codex, 20 Oktober 2026).

## SEO, aksesibilitas, dan Lighthouse

- [x] `/sitemap.xml` dan `/robots.txt` terbangun; semua gambar publik yang ditemukan memiliki `alt`.
- [x] Kontras tema dicatat pada log T-010; focus-visible dan reduced-motion tersedia.
- [ ] Lighthouse homepage: localhost:3000 Performance 64, SEO 100, Accessibility 100; localhost:3001 Performance 48, SEO 91, Accessibility 100. Kedua port menyajikan bundle development, sehingga skor ini bukan validasi production; target Performance ≥85 belum terverifikasi.
- [ ] Lighthouse `/berita`, `/profil`, `/spmb`: catat skor Performance/SEO/Accessibility.
- [x] Uji keyboard nav, fokus modal galeri, FAQ, menu mobile, dan form berlabel. Codex, Playwright, 20 Oktober 2026: dropdown profil dapat dibuka dengan Enter; lightbox memindahkan fokus ke tombol Tutup, menahan Tab/Shift+Tab, Escape menutup dan mengembalikan fokus; menu mobile aktif dengan Enter dan menutup dengan Escape; FAQ beasiswa cocok; lima field pesan punya label native.
- [x] Screenshot 360px/1440px disimpan di `public/qa-screenshots/` lewat Playwright CLI. Script bash tidak dapat dipakai di host Windows karena bash launcher WSL tidak tersedia.

## Audit dependency

`npm audit --omit=dev` pada 20 Oktober 2026: 29 temuan (26 moderate, 2 high, 1 critical). Perbaikan yang ditawarkan npm untuk Next.js dan Tiptap memerlukan major upgrade (Next 16, Tiptap 3); `xlsx` tidak memiliki versi perbaikan yang ditawarkan. Next 14 dan Tiptap 2 dipertahankan mengikuti stack blueprint; temuan perlu keputusan upgrade/remediasi sebelum go-live.

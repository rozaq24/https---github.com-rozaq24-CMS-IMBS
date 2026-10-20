# QA Checklist CMS IMBS

Catat nama penguji, tanggal, browser/perangkat, bukti, dan hasil aktual sebelum mengubah status menjadi selesai. Jangan tandai uji yang belum dijalankan.

## Build dan schema

| Pemeriksaan | Status | Bukti |
|---|---|---|
| `npx prisma validate` | ✅ | Codex, 20 Oktober 2026, schema valid |
| `npx prisma db seed` | ✅ | Codex, 20 Oktober 2026, berhasil dua kali tanpa duplikasi demo |
| `npx tsc --noEmit` | ✅ | Codex, 20 Oktober 2026, lolos |
| Build produksi Next.js terisolasi | ✅ | Codex, 20 Oktober 2026, `NEXT_DIST_DIR=.next-build npx next build` lolos |
| `npm run build` (termasuk Prisma Client generate) | ⏳ | Generate gagal mengganti query engine DLL karena file sedang dikunci proses dev yang ada |

## Matriks akses role

`200` berarti akses diharapkan diberikan; `403` berarti ditolak; `—` berarti modul publik. Jalankan melalui browser/API dengan lima akun demo sebelum go-live.

| Role | Users/settings | Berita/pages | Siswa/kelas | SPMB | Baca konten publik |
|---|---:|---:|---:|---:|---:|
| SUPERADMIN | 200 | 200 | 200 | 200 | 200 |
| OPERATOR_BERITA | 403 | 200 | 403 | 403 | 200 |
| OPERATOR_SPMB | 403 | 403 | 200 | 200 | 200 |
| GURU | 403 | 403 | 403 | 403 | 200 |
| WALI_READONLY | 403 | 403 | 403 | 403 | 200 |

Status runtime: ⏳ belum dijalankan. Playwright tidak dapat memuat `http://localhost:3001/` (timeout menunggu `domcontentloaded`); server dev aktif memakai aset `.next` yang sebelumnya tertimpa build default.

## Alur fitur

- [ ] Login/logout untuk lima role; cek pasangan status 200/403 di atas.
- [ ] Admin: tambah/edit publikasi, halaman, guru, siswa, menu, dan pengaturan.
- [ ] Import XLSX 100 baris: jumlah valid, invalid, duplikat, dan preview cocok.
- [ ] SPMB: periode aktif/tutup, daftar lengkap dan parsial, file PDF/JPG valid, file MIME/payload palsu ditolak, duplikat NIK/email ditolak, kode+NIK cek status, keputusan operator, statistik, dan CSV.
- [ ] Pengaduan masuk ke inbox; komentar menunggu moderasi.
- [ ] 360px dan 1440px: homepage, berita, profil, SPMB, FAQ, galeri, form, menu mobile, dark mode.
- [ ] FAQ pencarian `beasiswa` memberi jawaban terkait.
- [ ] Upload berkas SPMB ditolak untuk role publik dan dapat dibuka operator.
- [x] Backup SQLite, restore ke salinan terpisah, 21 tabel dan row count cocok, `PRAGMA quick_check` = `ok` (Codex, 20 Oktober 2026).

## SEO, aksesibilitas, dan Lighthouse

- [x] `/sitemap.xml` dan `/robots.txt` terbangun; semua gambar publik yang ditemukan memiliki `alt`.
- [x] Kontras tema dicatat pada log T-010; focus-visible dan reduced-motion tersedia.
- [ ] Lighthouse homepage: Performance __, SEO __, Accessibility __ (target masing-masing ≥85).
- [ ] Lighthouse `/berita`, `/profil`, `/spmb`: catat skor Performance/SEO/Accessibility.
- [ ] Uji keyboard nav, fokus modal galeri, FAQ, menu mobile, dan form berlabel.
- [ ] Screenshot: jalankan `./qa-playwright-capture.sh http://localhost:8000 public/qa-screenshots` setelah server siap.

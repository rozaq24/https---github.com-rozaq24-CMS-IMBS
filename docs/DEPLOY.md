# Panduan Deploy CMS IMBS

## Persiapan lokal

1. Pasang Node.js 22.12 atau lebih baru dan npm.
2. Jalankan `npm ci`.
3. Salin `.env.example` menjadi `.env`, lalu isi `NEXTAUTH_SECRET` dengan nilai acak minimal 32 karakter dan sesuaikan `NEXTAUTH_URL`.
4. Untuk pengembangan SQLite, jalankan `npx prisma db push`, `npx prisma db seed`, lalu `npm run dev`.
5. Login demo memakai akun di bagian **Akun demo**. Ganti semua kata sandi contoh sebelum situs dibuka untuk umum.

## Production pada VM + PostgreSQL

Upload SPMB saat ini disimpan lokal (`storage/spmb`) dan media situs di `public/uploads`. Gunakan VM dengan disk persisten dan backup terjadwal. Deployment serverless seperti Vercel memerlukan penyimpanan objek persisten terlebih dahulu; filesystem fungsi serverless tidak menjadi tempat penyimpanan berkas pengguna.

1. Siapkan PostgreSQL dan buat database kosong khusus CMS.
2. Salin kode ke VM, pasang Node.js 22.12 atau lebih baru, lalu jalankan `npm ci`.
3. Pada `prisma/schema.prisma`, ubah provider datasource dari `sqlite` ke `postgresql`. Buat migration awal pada salinan staging dengan `npx prisma migrate dev --name init`, review dan simpan folder `prisma/migrations` ke source control. Jangan membuat migration dari database produksi.
4. Konfigurasikan environment layanan: `DATABASE_URL` (PostgreSQL), `NEXTAUTH_SECRET` (acak dan rahasia), serta `NEXTAUTH_URL` (origin HTTPS publik).
5. Untuk database kosong, jalankan `npx prisma migrate deploy`, `npx prisma generate`, lalu `npx prisma db seed`. Seed membuat akun demo; ubah kata sandinya sebelum membuka akses publik.
6. Jalankan `npm run build`, kemudian jalankan aplikasi dengan process manager layanan VM (mis. systemd) dan reverse proxy HTTPS.
7. Pastikan `/`, `/sitemap.xml`, `/robots.txt`, login admin, formulir SPMB, dan unggah gambar dapat digunakan. Pastikan direktori `storage/spmb` dan `public/uploads` persisten serta hanya dapat ditulis user aplikasi.

### Pindah data SQLite ke PostgreSQL

Mengubah `DATABASE_URL` saja tidak memindahkan data. Buat backup SQLite, buat database PostgreSQL kosong dan migration dari schema yang telah memakai provider `postgresql`, lalu pindahkan tabel dalam urutan relasi (User/Major/Teacher/ClassRoom, lalu Student/Post/Comment/SPMB dan tabel lain). Pertahankan seluruh ID, cek jumlah record per tabel dan relasi, lalu pindahkan folder unggahan dengan path yang sama. Buka situs staging dan cek login serta halaman publik sebelum mengganti traffic. Simpan file SQLite dan backup sampai proses verifikasi disetujui.

Jangan jalankan seed demo pada database produksi yang berisi data sekolah. Pastikan migration, restore backup, dan ruang penyimpanan diuji lebih dulu.

## Akun demo

| Peran | Email | Kata sandi awal |
|---|---|---|
| SUPERADMIN | `admin@sekolah.sch.id` | `ImbsDemo!2026` |
| OPERATOR_BERITA | `operator.berita@sekolah.sch.id` | `ImbsDemo!2026` |
| OPERATOR_SPMB | `operator.spmb@sekolah.sch.id` | `ImbsDemo!2026` |
| GURU | `guru@sekolah.sch.id` | `ImbsDemo!2026` |
| WALI_READONLY | `wali@sekolah.sch.id` | `ImbsDemo!2026` |

Seed demo menyelaraskan nama, role, status aktif, dan kata sandi kelima akun demo setiap kali dijalankan. Jangan jalankan seed demo pada database produksi yang berisi akun sekolah.

## Rollback

1. Hentikan traffic ke release baru.
2. Pulihkan backup PostgreSQL yang diambil sebelum migration.
3. Kembalikan release aplikasi sebelumnya dan arahkan `DATABASE_URL` ke database hasil restore.
4. Pulihkan unggahan dari backup jika berkas berubah sejak snapshot.
5. Verifikasi login admin dan halaman publik sebelum mengaktifkan kembali traffic.

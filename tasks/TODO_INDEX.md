# TODO_INDEX — CMS IMBS (Roadmap Resmi)

> Baca file ini untuk tahu urutan kerja. Detail tiap task ada di file `T-*.md` masing-masing.
> Status ringkas — status asli ada di frontmatter tiap file.

## Fase 0 — Fondasi (P0) — kerjakan berurutan

- [x] **T-001 — Setup Fondasi Next.js + Prisma + Tailwind + Auth Skeleton** (`tasks/T-001-setup-fondasi.md`) — STATUS: DONE
- [x] **T-002 — RBAC + User Management + SystemLog** (`tasks/T-002-rbac-log.md`) — STATUS: DONE
- [x] **T-003 — Post CRUD + Editor Visual (Berita/Pengumuman/Agenda/Artikel)** (`tasks/T-003-post-crud.md`) — STATUS: DONE

## Fase 1 — Blog & Konten Web (Blueprint Admin #1)

- [x] **T-004 — Custom Pages + Kata Sambutan Kepsek** (`tasks/T-004-pages-sambutan.md`) — DONE
- [ ] **T-005 — Galeri & Media + Komentar/Messages** (`tasks/T-005-galeri-komentar.md`) — REVIEW

## Fase 2 — Data Induk & Akademik (Blueprint Admin #2)

- [x] **T-006 — GTK/Guru + Direktori Publik** (`tasks/T-006-gtk.md`) — DONE
- [x] **T-007 — Siswa/Kelas + Import Excel + Kenaikan/Kelulusan** (`tasks/T-007-siswa.md`) — DONE
- [x] **T-008 — Jurusan/Ekskul/Prestasi + Agenda + Download Center** (`tasks/T-008-akademik-lain.md`) — DONE

## Fase 3 — Tampilan & Navigasi (Blueprint Admin #3 + UI Rules Frontend #5)

- [x] **T-009 — Menu Builder Drag-Drop 3 Level** (`tasks/T-009-menu-builder.md`) — DONE
- [ ] **T-010 — Tema 10 Warna + Dark Mode + Identitas/SEO (Golden Ratio + ReactBits)** (`tasks/T-010-tema-identitas.md`) — DOING

## Fase 4 — Layanan Khusus & Publik (Blueprint Admin #4 + Frontend #2/#3)

- [ ] **T-011 — SPMB Online (publik + validasi operator + statistik)** (`tasks/T-011-spmb.md`) — TODO
- [ ] **T-012 — Halaman Publik: Profil/Agenda/Download/FAQ/Pengaduan/E-Learning/Perpus** (`tasks/T-012-halaman-publik.md`) — TODO

## Fase 5 — Hardening & Go-Live

- [ ] **T-013 — Seed, QA, SEO, Aksesibilitas, Deploy** (`tasks/T-013-go-live.md`) — TODO

## Cara Memakai Index Ini (untuk semua agent)

1. Pilih 1 task TODO dengan fase terkecil + P0 dulu.
2. Buka file task-nya, ubah `status: TODO → DOING` + isi Log Agen.
3. Kerjakan hanya scope IN + AC di file itu.
4. Selesai → update checklist AC + status DONE + hasil `npm run build` / `prisma validate`.
5. Commit: `feat(T-XXX): <title> — <agent>` lalu lanjut ke task berikutnya.

## Peta Blueprint → Task

- Admin #1 (Blog & Konten) → T-003, T-004, T-005
- Admin #2 (SIAKAD Dasar) → T-006, T-007, T-008
- Admin #3 (Tampilan & Navigasi) → T-009, T-010
- Admin #4 (Layanan & Sistem) → T-005, T-008, T-011
- Admin #5 (Roles & Log) → T-002, T-013
- Frontend #1 (Profil) → T-006, T-012
- Frontend #2 (Publikasi) → T-003, T-005, T-008, T-012
- Frontend #3 (Akademik) → T-011, T-012
- Frontend #4 (FAQ/Interaksi) → T-005, T-012
- Frontend #5 (UI/UX Golden Ratio + ReactBits) → T-010 + semua halaman publik

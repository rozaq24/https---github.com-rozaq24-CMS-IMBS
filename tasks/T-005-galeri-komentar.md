---
id: T-005
title: Galeri & Media + Komentar dan Kotak Masuk
status: DONE
priority: P1
phase: 1
domain: admin/blog
blueprint_ref:
  - blueprint/blueprint fitur admin.md#1
  - blueprint/blueprint fitur admin.md#4
  - blueprint/blueprint fitur front end.md#2
  - blueprint/blueprint fitur front end.md#4
agent_suitability: [antigravity, codex]
depends_on: [T-001, T-003]
estimated: M
branch: feat/T-005-galeri-komentar
---

# T-005 — Galeri & Media + Komentar dan Kotak Masuk

## Tujuan
Album foto berkategori (Masonry ala ReactBits) + moderasi komentar blog + inbox pesan/pengaduan.

## Scope IN
- Album + Photo CRUD + upload multi + kategori + publik `/galeri` (Masonry + lightbox + filter kategori)
- Komentar: publik kirim (pending) → admin approve/hapus → tampil di detail berita; anti-spam honeypot + rate-limit sederhana
- Message: form kontak/pengaduan publik → `/admin/inbox` (baca, tandai read/replied, hapus)

## Scope OUT
- Download Center (T-008). FAQ (T-012).

## Files
- `src/app/api/albums/route.ts`, `src/app/api/photos/route.ts`, `src/app/api/comments/route.ts`, `src/app/api/messages/route.ts`
- `src/app/admin/galeri/page.tsx`, `src/app/admin/komentar/page.tsx`, `src/app/admin/inbox/page.tsx`
- `src/app/(public)/galeri/page.tsx`, `src/components/Masonry.tsx`, `src/components/ContactForm.tsx`

## Acceptance Criteria
- [x] Upload 5 foto → album tampil Masonry + lightbox jalan + kategori filter benar
- [x] Komentar pending tidak tampil publik sampai approved; approve → tampil; hapus → hilang
- [x] Pesan pengaduan masuk inbox + badge unread; tandai dibaca terpersist
- [x] `npm run build` lolos pada salinan verifikasi terisolasi

## Uji Manual
1. Buat album "Upacara" + upload foto → cek /galeri.
2. Komentar di /berita/x → cek pending di admin → approve → cek tampil.
3. Kirim pengaduan → cek inbox.

## Log Agen
- [2026-10-20] Codex - DOING: scoped implementation and existing-system review.

- [2026-10-20] Codex - REVIEW: npx tsc --noEmit dan npx next build lolos; browser QA menunggu server dev dipulihkan.
- [2026-10-20] Codex - REVIEW: uji browser pengaduan berhasil membuat pesan, menampilkan badge unread 1, menyimpan status dibaca (unread 0), lalu menghapus pesan uji. Uji upload 5 foto dan moderasi komentar belum dijalankan; task tetap REVIEW.
- [2026-10-20] Codex - DONE: upload lima file gambar sintetis membuat album lima foto; filter kategori menampilkan album QA; lightbox terbuka dan ditutup dengan Escape. Komentar uji tidak tampil publik saat pending, tampil setelah disetujui, dan hilang setelah dihapus. Pesan pengaduan uji muncul di inbox, unread turun 1→0 setelah ditandai dibaca, lalu dihapus. Seluruh record/file uji dibersihkan. Build produksi terisolasi terbaru lolos (78 rute).

# Data Model (Prisma) — ringkasan manusiawi. Sumber resmi: `prisma/schema.prisma`.

## Enum
- `Role`: SUPERADMIN, OPERATOR_BERITA, OPERATOR_SPMB, GURU, WALI_READONLY
- `PostType`: BERITA, PENGUMUMAN, AGENDA, ARTIKEL
- `PostStatus`: DRAFT, SCHEDULED, PUBLISHED, ARCHIVED
- `ApplicantStatus`: PENDING, VERIFIED, REJECTED, ACCEPTED

## Tabel Inti
- **User** (id, name, email unique, passwordHash, role, avatar, active, lastLoginAt) → relasi SystemLog, Comment(moderatedBy), SPMBApplicant(verifiedBy)
- **Post** (slug unique, title, excerpt, content HTML TipTap, cover, type, status, publishedAt, authorId, views) → Comment[]
- **CustomPage** (slug unique, title, content, showInMenu, order)
- **Greeting** (singleton id=1: title, body, principalName, photo, active)
- **Album + Photo** (kategori galeri 1-N)
- **Teacher** (nip unique, name, position, rank, education, experience, photo, subjects, active) — direktori publik
- **Student** (nis unique, nisn, name, gender, classId FK, year, status AKTIF/LULUS/PINDAH/KELUAR)
- **ClassRoom** (name unique mis. "XII TKJ 1", majorId FK nullable, homeroomTeacherId FK nullable, year) → Student[]
- **Major** (jurusan/kompetensi keahlian), **Extracurricular**, **Achievement** (polimorfik: siswa/guru via studentId/teacherId nullable + title, level, year, photo)
- **Agenda** (pisah dari Post agar kalender ringan: title, desc, location, startAt, endAt)
- **DownloadFile** (title, desc, fileUrl, size, downloads, category, public)
- **MenuItem** (label, href/pageSlug, parentId self, order, visible, target; max depth 3 — validasi di API)
- **SiteSetting** (key unique, value JSON string: theme, identity, seo, contact, socials)
- **Comment** (postId, name, email, body, approved, moderatedBy)
- **Message** (pengaduan/kontak: name, email/phone, subject, body, read, replied)
- **SPMBPeriod + SPMBApplicant** (periode 1-N pendaftar; berkas JSON paths; verifiedBy, verifiedAt, note)
- **SystemLog** (userId nullable, ip, mac nullable, action, detail, createdAt; index userId+createdAt)

## Relasi Kunci
User 1-N Post, Comment N-1 Post, Album 1-N Photo, ClassRoom 1-N Student, Major 1-N ClassRoom, SPMBPeriod 1-N SPMBApplicant.

## Catatan SQLite→Postgres
- Gunakan `String @id @default(cuid())` agar portabel.
- `DateTime` untuk schedule/publish/agenda.
- File upload disimpan sebagai path string, bukan BLOB.

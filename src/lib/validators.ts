import { z } from "zod";

export const postSchema = z.object({
  title: z.string().min(5, "Judul minimal 5 karakter"),
  slug: z.string().min(3).optional(),
  excerpt: z.string().max(300).optional(),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  cover: z.string().optional(),
  type: z.enum(["BERITA", "PENGUMUMAN", "AGENDA", "ARTIKEL"]).default("BERITA"),
  status: z.enum(["DRAFT", "SCHEDULED", "PUBLISHED", "ARCHIVED"]).default("DRAFT"),
  publishedAt: z.string().optional(),
});

// Slug yang tidak boleh dipakai CustomPage agar tak bentrok route sistem/publik
export const RESERVED_SLUGS = [
  "admin", "api", "berita", "spmb", "galeri", "guru", "profil", "sambutan",
  "program", "prestasi", "agenda", "download", "faq", "pengaduan",
  "e-learning", "perpustakaan", "ekstrakurikuler", "login", "berita.xml",
  "sitemap.xml", "robots.txt", "favicon.ico",
];

export const pageSchema = z.object({
  title: z.string().min(3, "Judul minimal 3 karakter"),
  slug: z.string().min(3).max(80).regex(/^[a-z0-9-]+$/, "Slug hanya huruf kecil, angka, strip").optional()
    .refine((s) => !s || !RESERVED_SLUGS.includes(s.toLowerCase()), "Slug ini dipakai sistem, pilih slug lain"),
  content: z.string().min(20, "Konten minimal 20 karakter"),
  builderData: z.string().max(250_000).optional(),
  showInMenu: z.boolean().default(true),
  order: z.number().int().min(0).default(0),
});

export const greetingSchema = z.object({
  title: z.string().min(3).default("Sambutan Kepala Sekolah"),
  body: z.string().min(20, "Isi sambutan minimal 20 karakter"),
  principalName: z.string().min(3, "Nama kepala sekolah wajib diisi"),
  photo: z.string().optional(),
  active: z.boolean().default(true),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().optional().or(z.literal("")),
  body: z.string().trim().min(3).max(2000),
  website: z.string().max(0).optional(),
});

export const messageSchema = z.object({
  name: z.string().trim().min(2).max(100),
  email: z.string().trim().email().optional().or(z.literal("")),
  phone: z.string().trim().max(30).optional(),
  subject: z.string().trim().min(3).max(150),
  body: z.string().trim().min(5).max(5000),
  website: z.string().max(0).optional(),
});

export const teacherSchema = z.object({
  nip: z.string().trim().min(3).max(30),
  name: z.string().trim().min(3).max(120),
  position: z.string().trim().min(2).max(100).default("Guru"),
  rank: z.string().trim().max(80).optional(),
  education: z.string().trim().max(200).optional(),
  experience: z.string().trim().max(500).optional(),
  subjects: z.string().trim().max(200).optional(),
  photo: z.string().max(500).optional(),
  active: z.boolean().default(true),
});

export const classroomSchema = z.object({
  name: z.string().trim().min(2).max(80),
  year: z.string().trim().min(4).max(20),
  majorId: z.string().nullable().optional(),
  homeroomTeacherId: z.string().nullable().optional(),
});

export const studentSchema = z.object({
  nis: z.string().trim().min(1).max(30),
  nisn: z.string().trim().max(30).optional(),
  name: z.string().trim().min(3).max(120),
  gender: z.enum(["L", "P"]).optional(),
  classId: z.string().nullable().optional(),
  year: z.string().trim().max(20).optional(),
  status: z.enum(["AKTIF", "LULUS", "PINDAH", "KELUAR"]).default("AKTIF"),
});

export const majorSchema = z.object({ code: z.string().trim().min(2).max(20), name: z.string().trim().min(2).max(120), desc: z.string().max(2000).optional() });
export const extracurricularSchema = z.object({ name: z.string().trim().min(2).max(120), coach: z.string().max(120).optional(), schedule: z.string().max(200).optional(), desc: z.string().max(2000).optional(), photo: z.string().max(500).optional(), active: z.boolean().default(true) });
export const achievementSchema = z.object({ title: z.string().trim().min(3).max(200), level: z.string().max(100).optional(), year: z.string().max(20).optional(), photo: z.string().max(500).optional(), desc: z.string().max(2000).optional(), studentId: z.string().nullable().optional(), teacherId: z.string().nullable().optional() }).refine((v) => Boolean(v.studentId) !== Boolean(v.teacherId), "Pilih tepat satu siswa atau guru");
export const agendaSchema = z.object({ title: z.string().trim().min(3).max(200), desc: z.string().max(3000).optional(), location: z.string().max(200).optional(), startAt: z.string().datetime(), endAt: z.string().datetime().optional() }).refine((v) => !v.endAt || new Date(v.endAt) >= new Date(v.startAt), { message: "Waktu selesai harus setelah waktu mulai", path: ["endAt"] });
export const downloadSchema = z.object({ title: z.string().trim().min(3).max(200), desc: z.string().max(1000).optional(), category: z.string().trim().min(2).max(80).default("Umum"), public: z.boolean().default(true) });

const localImage = z.string().max(500).refine((v) => !v || v.startsWith("/uploads/"), "Gunakan gambar yang sudah diunggah");
const externalUrl = z.string().max(500).refine((v) => !v || /^https?:\/\//i.test(v), "URL harus memakai http/https");
export const siteIdentitySchema = z.object({
  siteTitle: z.string().trim().min(3).max(100), description: z.string().trim().min(10).max(300), keywords: z.string().max(500),
  logo: localImage, favicon: localImage,
  address: z.string().max(300), phone: z.string().max(50), email: z.union([z.string().email(), z.literal("")]), mapUrl: externalUrl,
  facebook: externalUrl, instagram: externalUrl, youtube: externalUrl,
});
export const settingsUpdateSchema = z.object({ theme: z.enum(["emerald","blue","indigo","violet","rose","orange","teal","cyan","lime","slate"]).optional(), identity: siteIdentitySchema.partial().optional() });

export const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB", "GURU", "WALI_READONLY"]),
});

export const menuSchema = z.object({
  label: z.string().min(2),
  href: z.string().default("#").refine((href) => href === "#" || (href.startsWith("/") && !href.startsWith("//")) || /^https?:\/\//i.test(href), "Tautan harus berupa path lokal atau URL http/https"),
  parentId: z.string().min(1).nullable().optional(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
  target: z.enum(["_self", "_blank"]).default("_self"),
  pageSlug: z.string().nullable().optional(),
});

const spmbPeriodFields = z.object({
  name: z.string().trim().min(3).max(120), year: z.string().trim().min(4).max(9),
  quota: z.coerce.number().int().positive().max(10000), openAt: z.coerce.date(), closeAt: z.coerce.date(),
  terms: z.string().max(10000).optional(), active: z.boolean().default(true),
});
export const spmbPeriodSchema = spmbPeriodFields.refine((v) => v.closeAt >= v.openAt, { message: "Tanggal penutupan harus setelah pembukaan", path: ["closeAt"] });
export const spmbPeriodUpdateSchema = spmbPeriodFields.partial().refine((v) => !v.openAt || !v.closeAt || v.closeAt >= v.openAt, { message: "Tanggal penutupan harus setelah pembukaan", path: ["closeAt"] });
export const spmbSchema = z.object({
  periodId: z.string().min(1), name: z.string().trim().min(3).max(120),
  nik: z.string().trim().regex(/^\d{16}$/, "NIK harus 16 digit"),
  email: z.union([z.string().trim().email().max(254), z.literal("")]),
  phone: z.string().trim().min(9).max(30), origin: z.string().trim().min(3).max(160),
  parentName: z.string().trim().min(3).max(120),
});
export const spmbDecisionSchema = z.object({ status: z.enum(["VERIFIED", "REJECTED", "ACCEPTED"]), note: z.string().trim().max(2000).optional() });

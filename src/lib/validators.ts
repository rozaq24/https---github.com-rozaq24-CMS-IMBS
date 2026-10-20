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

export const userSchema = z.object({
  name: z.string().min(3),
  email: z.string().email(),
  password: z.string().min(6),
  role: z.enum(["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB", "GURU", "WALI_READONLY"]),
});

export const menuSchema = z.object({
  label: z.string().min(2),
  href: z.string().default("#"),
  parentId: z.string().nullable().optional(),
  order: z.number().int().default(0),
  visible: z.boolean().default(true),
});

export const spmbSchema = z.object({
  periodId: z.string(),
  name: z.string().min(3),
  nik: z.string().min(10).optional(),
  email: z.string().email().optional(),
  phone: z.string().min(9),
  origin: z.string().min(3),
  parentName: z.string().min(3),
});

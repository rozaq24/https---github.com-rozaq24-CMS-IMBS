import type { MetadataRoute } from "next";
import { db } from "@/lib/db";

export const revalidate = 3600;
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = (process.env.NEXTAUTH_URL || "http://localhost:3000").replace(/\/$/, "");
  const [posts, pages, teachers] = await Promise.all([
    db.post.findMany({ where: { status: "PUBLISHED", publishedAt: { lte: new Date() } }, select: { slug: true, updatedAt: true } }),
    db.customPage.findMany({ select: { slug: true, updatedAt: true } }),
    db.teacher.findMany({ where: { active: true }, select: { id: true, updatedAt: true } }),
  ]);
  const routes = ["", "/profil", "/sambutan", "/guru", "/program", "/ekstrakurikuler", "/prestasi", "/berita", "/agenda", "/galeri", "/download", "/spmb", "/faq", "/pengaduan", "/e-learning", "/perpustakaan"];
  return [
    ...routes.map((route) => ({ url: `${base}${route || "/"}`, changeFrequency: route === "" ? "daily" as const : "weekly" as const, priority: route === "" ? 1 : 0.7 })),
    ...posts.map((post) => ({ url: `${base}/berita/${post.slug}`, lastModified: post.updatedAt, changeFrequency: "monthly" as const, priority: 0.6 })),
    ...pages.map((page) => ({ url: `${base}/${page.slug}`, lastModified: page.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
    ...teachers.map((teacher) => ({ url: `${base}/guru/${teacher.id}`, lastModified: teacher.updatedAt, changeFrequency: "monthly" as const, priority: 0.5 })),
  ];
}

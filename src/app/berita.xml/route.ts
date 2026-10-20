import { db } from "@/lib/db";

export async function GET() {
  const posts = await db.post.findMany({
    where: { status: "PUBLISHED" },
    orderBy: { publishedAt: "desc" },
    take: 20,
  });
  const base = process.env.NEXTAUTH_URL || "http://localhost:3000";
  const items = posts.map((p) => `
    <item><title><![CDATA[${p.title}]]></title><link>${base}/berita/${p.slug}</link><guid>${base}/berita/${p.slug}</guid><pubDate>${(p.publishedAt || p.createdAt).toUTCString()}</pubDate></item>`).join("");
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>CMS IMBS — Berita</title><link>${base}/berita</link><description>Publikasi terbaru</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { "Content-Type": "application/rss+xml; charset=utf-8" } });
}

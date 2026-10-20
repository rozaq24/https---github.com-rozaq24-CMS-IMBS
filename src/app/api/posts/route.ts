import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { postSchema } from "@/lib/validators";
import { cleanHtml, isDueToPublish, uniqueSlug } from "@/lib/posts";

const PAGE_SIZE = 20;
const POST_ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

// GET /api/posts?type=&status=&q=&page=&public=1 — publik hanya lihat PUBLISHED
export async function GET(req: Request) {
  const url = new URL(req.url);
  const isPublic = url.searchParams.get("public") === "1";
  if (!isPublic) {
    const { error } = await requireRole(POST_ROLES);
    if (error) return error;
  }
  const type = url.searchParams.get("type") || undefined;
  const q = url.searchParams.get("q") || "";
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  let status = url.searchParams.get("status") || undefined;
  if (isPublic) status = "PUBLISHED";
  const now = new Date();
  const where = {
    ...(type ? { type } : {}),
    ...(status ? { status } : {}),
    ...(isPublic ? { publishedAt: { lte: now } } : {}),
    ...(q ? { OR: [{ title: { contains: q } }, { excerpt: { contains: q } }] } : {}),
  };
  const [total, data] = await Promise.all([
    db.post.count({ where }),
    db.post.findMany({
      where,
      include: { author: { select: { name: true } } },
      orderBy: { publishedAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return NextResponse.json({ data, total, page, pageSize: PAGE_SIZE });
}

// POST /api/posts — OPERATOR_BERITA / SUPERADMIN
export async function POST(req: Request) {
  const { error, session } = await requireRole(POST_ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const v = parsed.data;
  const slug = await uniqueSlug(v.slug || v.title, async (s) => !!(await db.post.findUnique({ where: { slug: s } })));
  // SCHEDULED tanpa tanggal -> tolak; PUBLISHED tanpa tanggal -> isi sekarang
  let publishedAt: Date | null = v.publishedAt ? new Date(v.publishedAt) : null;
  if (v.status === "SCHEDULED" && !publishedAt) {
    return NextResponse.json({ error: "Jadwal terbit wajib diisi untuk status SCHEDULED" }, { status: 400 });
  }
  if (v.status === "PUBLISHED" && !publishedAt) publishedAt = new Date();
  // Auto-publish: SCHEDULED yang waktunya sudah lewat langsung jadi PUBLISHED
  let status = v.status;
  if (isDueToPublish(status, publishedAt)) status = "PUBLISHED";
  const post = await db.post.create({
    data: {
      slug,
      title: v.title,
      excerpt: v.excerpt || null,
      content: cleanHtml(v.content),
      cover: v.cover || null,
      type: v.type,
      status,
      publishedAt,
      authorId: session!.user.id,
    },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: status === "PUBLISHED" ? "POST_PUBLISH" : "POST_CREATE", detail: `${post.slug}` });
  return NextResponse.json(post, { status: 201 });
}

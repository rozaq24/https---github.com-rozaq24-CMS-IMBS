import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole } from "@/lib/auth-helpers";
import { commentSchema } from "@/lib/validators";
import { allowRequest } from "@/lib/rate-limit";

export async function GET(req: Request) {
  const url = new URL(req.url);
  const admin = url.searchParams.get("admin") === "1";
  if (admin) {
    const { error } = await requireRole(["SUPERADMIN", "OPERATOR_BERITA"]);
    if (error) return error;
  }
  const postId = url.searchParams.get("postId");
  if (!admin && !postId) return NextResponse.json({ error: "postId wajib diisi" }, { status: 400 });
  const data = admin
    ? await db.comment.findMany({ include: { post: { select: { title: true, slug: true } } }, orderBy: { createdAt: "desc" } })
    : await db.comment.findMany({ where: { postId: postId!, approved: true }, orderBy: { createdAt: "asc" }, select: { id: true, name: true, body: true, createdAt: true } });
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (body?.website) return NextResponse.json({ ok: true }, { status: 201 });
  const parsed = commentSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Periksa nama, email, dan isi komentar" }, { status: 400 });
  const ip = getClientIp(req);
  if (!allowRequest(`comment:${ip}`)) return NextResponse.json({ error: "Terlalu banyak komentar. Coba lagi dalam satu menit." }, { status: 429 });
  const post = await db.post.findUnique({ where: { id: parsed.data.postId }, select: { id: true, status: true, publishedAt: true } });
  if (!post || post.status !== "PUBLISHED" || (post.publishedAt && post.publishedAt > new Date())) return NextResponse.json({ error: "Berita tidak menerima komentar" }, { status: 404 });
  const comment = await db.comment.create({ data: { postId: post.id, name: parsed.data.name, email: parsed.data.email || null, body: parsed.data.body } });
  return NextResponse.json({ ok: true, id: comment.id, message: "Komentar menunggu moderasi." }, { status: 201 });
}

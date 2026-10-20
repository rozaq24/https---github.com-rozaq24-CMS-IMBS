import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { postSchema } from "@/lib/validators";
import { cleanHtml, isDueToPublish } from "@/lib/posts";

const POST_ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

// GET /api/posts/:id — admin/editor
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireRole(POST_ROLES);
  if (error) return error;
  const post = await db.post.findUnique({ where: { id: params.id }, include: { author: { select: { name: true } } } });
  if (!post) return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  return NextResponse.json(post);
}

// PATCH /api/posts/:id — termasuk tombol Publish (status -> PUBLISHED)
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(POST_ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = postSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const target = await db.post.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  const v = parsed.data;
  let status = v.status ?? target.status;
  let publishedAt: Date | null = v.publishedAt !== undefined ? (v.publishedAt ? new Date(v.publishedAt) : null) : target.publishedAt;
  if (status === "SCHEDULED" && !publishedAt) {
    return NextResponse.json({ error: "Jadwal terbit wajib diisi untuk status SCHEDULED" }, { status: 400 });
  }
  if (status === "PUBLISHED" && !publishedAt) publishedAt = new Date();
  if (isDueToPublish(status, publishedAt)) status = "PUBLISHED";
  // slug bila diubah: pastikan unik (kecuali milik sendiri)
  let slug = target.slug;
  if (v.slug && v.slug !== target.slug) {
    const used = await db.post.findUnique({ where: { slug: v.slug } });
    if (used) return NextResponse.json({ error: "Slug sudah dipakai post lain" }, { status: 409 });
    slug = v.slug;
  }
  const post = await db.post.update({
    where: { id: params.id },
    data: {
      ...(v.title ? { title: v.title } : {}),
      slug,
      ...(v.excerpt !== undefined ? { excerpt: v.excerpt || null } : {}),
      ...(v.content ? { content: cleanHtml(v.content) } : {}),
      ...(v.cover !== undefined ? { cover: v.cover || null } : {}),
      ...(v.type ? { type: v.type } : {}),
      status,
      publishedAt,
    },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: status === "PUBLISHED" && target.status !== "PUBLISHED" ? "POST_PUBLISH" : "POST_UPDATE", detail: post.slug });
  return NextResponse.json(post);
}

// DELETE /api/posts/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(POST_ROLES);
  if (error) return error;
  const target = await db.post.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  await db.post.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "POST_DELETE", detail: target.slug });
  return NextResponse.json({ ok: true });
}

// POST /api/posts/:id/publish — alias cepat untuk tombol Terbitkan (dipakai juga via PATCH, disediakan untuk kejelasan)
export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(POST_ROLES);
  if (error) return error;
  const target = await db.post.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Post tidak ditemukan" }, { status: 404 });
  const post = await db.post.update({ where: { id: params.id }, data: { status: "PUBLISHED", publishedAt: target.publishedAt ?? new Date() } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "POST_PUBLISH", detail: post.slug });
  return NextResponse.json(post);
}

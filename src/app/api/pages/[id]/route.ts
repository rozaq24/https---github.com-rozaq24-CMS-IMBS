import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { pageSchema } from "@/lib/validators";
import { cleanHtml } from "@/lib/posts";

const PAGE_ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

// GET /api/pages/:id
export async function GET(_req: Request, { params }: { params: { id: string } }) {
  const { error } = await requireRole(PAGE_ROLES);
  if (error) return error;
  const page = await db.customPage.findUnique({ where: { id: params.id } });
  if (!page) return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
  return NextResponse.json(page);
}

// PATCH /api/pages/:id
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(PAGE_ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = pageSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const target = await db.customPage.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
  const v = parsed.data;
  let slug = target.slug;
  if (v.slug && v.slug !== target.slug) {
    const used = await db.customPage.findUnique({ where: { slug: v.slug } });
    if (used) return NextResponse.json({ error: "Slug sudah dipakai halaman lain" }, { status: 409 });
    slug = v.slug;
  }
  const page = await db.customPage.update({
    where: { id: params.id },
    data: {
      ...(v.title ? { title: v.title } : {}),
      slug,
      ...(v.content ? { content: cleanHtml(v.content) } : {}),
      ...(v.builderData !== undefined ? { builderData: v.builderData } : {}),
      ...(v.showInMenu !== undefined ? { showInMenu: v.showInMenu } : {}),
      ...(v.order !== undefined ? { order: v.order } : {}),
    },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PAGE_UPDATE", detail: page.slug });
  return NextResponse.json(page);
}

// DELETE /api/pages/:id
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(PAGE_ROLES);
  if (error) return error;
  const target = await db.customPage.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });
  await db.customPage.delete({ where: { id: params.id } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PAGE_DELETE", detail: target.slug });
  return NextResponse.json({ ok: true });
}

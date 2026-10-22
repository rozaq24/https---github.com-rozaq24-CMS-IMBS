import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { cleanHtml, slugify, uniqueSlug } from "@/lib/posts";
import { pageSchema, RESERVED_SLUGS } from "@/lib/validators";
import { parseBuilderData } from "@/app/admin/builder/builder-types";

const PAGE_ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

// GET /api/pages?q= — admin (publik baca via /[slug] langsung dari DB)
export async function GET(req: Request) {
  const { error } = await requireRole(PAGE_ROLES);
  if (error) return error;
  const q = new URL(req.url).searchParams.get("q") || "";
  const data = await db.customPage.findMany({
    where: q ? { OR: [{ title: { contains: q } }, { slug: { contains: q } }] } : {},
    orderBy: [{ order: "asc" }, { title: "asc" }],
  });
  return NextResponse.json({ data, total: data.length });
}

// POST /api/pages — buat halaman statis
export async function POST(req: Request) {
  const { error, session } = await requireRole(PAGE_ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = pageSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const v = parsed.data;
  if (v.builderData && !parseBuilderData(v.builderData)) return NextResponse.json({ error: "Data IMBS Builder tidak valid" }, { status: 400 });
  const baseSlug = v.slug || slugify(v.title);
  if (RESERVED_SLUGS.includes(baseSlug)) {
    return NextResponse.json({ error: `Slug "${baseSlug}" dipakai sistem, pilih slug lain` }, { status: 400 });
  }
  const slug = await uniqueSlug(baseSlug, async (s) => !!(await db.customPage.findUnique({ where: { slug: s } })));
  const page = await db.customPage.create({
    data: { slug, title: v.title, content: cleanHtml(v.content), builderData: v.builderData, showInMenu: v.showInMenu, order: v.order },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PAGE_CREATE", detail: page.slug });
  return NextResponse.json(page, { status: 201 });
}

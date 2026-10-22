import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const PAGE_ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(PAGE_ROLES);
  if (error) return error;
  const source = await db.customPage.findUnique({ where: { id: params.id } });
  if (!source) return NextResponse.json({ error: "Halaman tidak ditemukan" }, { status: 404 });

  let suffix = 1;
  let slug = "";
  while (true) {
    const tail = suffix === 1 ? "-salinan" : `-salinan-${suffix}`;
    slug = `${source.slug.slice(0, 80 - tail.length)}${tail}`;
    if (!(await db.customPage.findUnique({ where: { slug }, select: { id: true } }))) break;
    suffix++;
  }

  const page = await db.customPage.create({
    data: {
      slug,
      title: `${source.title} (salinan)`,
      content: source.content,
      builderData: source.builderData,
      showInMenu: false,
      order: source.order + 1,
    },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "PAGE_DUPLICATE", detail: `${source.slug} -> ${page.slug}` });
  return NextResponse.json(page, { status: 201 });
}

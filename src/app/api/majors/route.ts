import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { majorSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function GET() { const { error } = await requireRole(ROLES); if (error) return error; return NextResponse.json({ data: await db.major.findMany({ orderBy: { name: "asc" } }) }); }
export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = majorSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Kode dan nama jurusan wajib diisi", issues: parsed.error.flatten() }, { status: 400 });
  try { const item = await db.major.create({ data: parsed.data }); await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "MAJOR_CREATE", detail: item.code }); return NextResponse.json(item, { status: 201 }); }
  catch (e) { const duplicate = (e as { code?: string })?.code === "P2002"; return NextResponse.json({ error: duplicate ? "Kode atau nama jurusan sudah dipakai" : "Jurusan gagal disimpan" }, { status: duplicate ? 409 : 400 }); }
}

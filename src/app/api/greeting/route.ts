import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { greetingSchema } from "@/lib/validators";

const GREETING_ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];

// GET /api/greeting — publik boleh baca (untuk homepage), admin untuk edit
export async function GET() {
  const greeting = await db.greeting.findUnique({ where: { id: 1 } });
  return NextResponse.json(greeting);
}

// PUT /api/greeting — update singleton sambutan (upsert bila belum ada)
export async function PUT(req: Request) {
  const { error, session } = await requireRole(GREETING_ROLES);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = greetingSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const v = parsed.data;
  const greeting = await db.greeting.upsert({
    where: { id: 1 },
    update: { title: v.title, body: v.body, principalName: v.principalName, photo: v.photo || null, active: v.active },
    create: { id: 1, title: v.title, body: v.body, principalName: v.principalName, photo: v.photo || null, active: v.active },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "GREETING_UPDATE", detail: v.principalName });
  return NextResponse.json(greeting);
}

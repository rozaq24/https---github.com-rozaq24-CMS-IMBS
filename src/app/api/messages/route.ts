import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole } from "@/lib/auth-helpers";
import { messageSchema } from "@/lib/validators";
import { allowRequest } from "@/lib/rate-limit";

export async function GET() {
  const { error } = await requireRole(["SUPERADMIN", "OPERATOR_BERITA"]);
  if (error) return error;
  const data = await db.message.findMany({ orderBy: [{ read: "asc" }, { createdAt: "desc" }] });
  return NextResponse.json({ data, unread: data.filter((m) => !m.read).length });
}

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  if (body?.website) return NextResponse.json({ ok: true }, { status: 201 });
  const parsed = messageSchema.safeParse(body);
  if (!parsed.success) return NextResponse.json({ error: "Periksa kembali data pesan" }, { status: 400 });
  const ip = getClientIp(req);
  if (!allowRequest(`message:${ip}`, 5)) return NextResponse.json({ error: "Terlalu banyak pesan. Coba lagi dalam satu menit." }, { status: 429 });
  const m = parsed.data;
  const message = await db.message.create({ data: { name: m.name, email: m.email || null, phone: m.phone || null, subject: m.subject, body: m.body } });
  return NextResponse.json({ ok: true, id: message.id, message: "Pesan berhasil dikirim." }, { status: 201 });
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { userSchema } from "@/lib/validators";

const PAGE_SIZE = 20;

// GET /api/users?role=&q=&page= — SUPERADMIN saja
export async function GET(req: Request) {
  const { error, session } = await requireRole(["SUPERADMIN"]);
  if (error) return error;
  const url = new URL(req.url);
  const role = url.searchParams.get("role") || undefined;
  const q = url.searchParams.get("q") || "";
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const where = {
    ...(role ? { role: role as never } : {}),
    ...(q ? { OR: [{ name: { contains: q } }, { email: { contains: q } }] } : {}),
  };
  const [total, data] = await Promise.all([
    db.user.count({ where }),
    db.user.findMany({
      where,
      select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true, createdAt: true },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
  ]);
  return NextResponse.json({ data, total, page, pageSize: PAGE_SIZE });
}

// POST /api/users — SUPERADMIN saja
export async function POST(req: Request) {
  const { error, session } = await requireRole(["SUPERADMIN"]);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = userSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const exists = await db.user.findUnique({ where: { email: parsed.data.email } });
  if (exists) return NextResponse.json({ error: "Email sudah terdaftar" }, { status: 409 });
  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await db.user.create({
    data: { name: parsed.data.name, email: parsed.data.email, passwordHash, role: parsed.data.role },
    select: { id: true, name: true, email: true, role: true, active: true, createdAt: true },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "USER_CREATE", detail: `${user.email} (${user.role})` });
  return NextResponse.json(user, { status: 201 });
}

import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";

const patchSchema = z.object({
  name: z.string().min(3).optional(),
  role: z.enum(["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB", "GURU", "WALI_READONLY"]).optional(),
  active: z.boolean().optional(),
  password: z.string().min(6).optional(),
});

// PATCH /api/users/:id — SUPERADMIN saja
export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(["SUPERADMIN"]);
  if (error) return error;
  const body = await req.json().catch(() => null);
  const parsed = patchSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: "Validasi gagal", issues: parsed.error.flatten() }, { status: 400 });
  }
  const target = await db.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  // cegah nonaktifkan diri sendiri / cabut SUPERADMIN terakhir
  if (target.id === session!.user.id && parsed.data.active === false) {
    return NextResponse.json({ error: "Tidak bisa menonaktifkan akun sendiri" }, { status: 400 });
  }
  const data: Record<string, unknown> = {};
  if (parsed.data.name) data.name = parsed.data.name;
  if (typeof parsed.data.active === "boolean") data.active = parsed.data.active;
  if (parsed.data.password) data.passwordHash = await bcrypt.hash(parsed.data.password, 10);
  if (parsed.data.role) {
    if (target.role === "SUPERADMIN" && parsed.data.role !== "SUPERADMIN") {
      const count = await db.user.count({ where: { role: "SUPERADMIN", active: true } });
      if (count <= 1) return NextResponse.json({ error: "Minimal 1 SUPERADMIN aktif harus ada" }, { status: 400 });
    }
    data.role = parsed.data.role;
  }
  const user = await db.user.update({
    where: { id: params.id },
    data,
    select: { id: true, name: true, email: true, role: true, active: true, lastLoginAt: true },
  });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "USER_UPDATE", detail: `${user.email} → ${JSON.stringify(parsed.data)}` });
  return NextResponse.json(user);
}

// DELETE /api/users/:id — SUPERADMIN saja (soft: nonaktifkan)
export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  const { error, session } = await requireRole(["SUPERADMIN"]);
  if (error) return error;
  if (params.id === session!.user.id) {
    return NextResponse.json({ error: "Tidak bisa menghapus akun sendiri" }, { status: 400 });
  }
  const target = await db.user.findUnique({ where: { id: params.id } });
  if (!target) return NextResponse.json({ error: "User tidak ditemukan" }, { status: 404 });
  await db.user.update({ where: { id: params.id }, data: { active: false } });
  await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "USER_DISABLE", detail: target.email });
  return NextResponse.json({ ok: true });
}

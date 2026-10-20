import { getServerSession } from "next-auth";
import { NextResponse } from "next/server";
import { authOptions, hasRole } from "./auth";
import { db } from "./db";

export async function requireSession() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return { session: null, error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  return { session, error: null };
}

export async function requireRole(allowed: string[]) {
  const { session, error } = await requireSession();
  if (error || !session) return { session: null, error: error! };
  if (!hasRole(session.user.role, allowed)) {
    return { session: null, error: NextResponse.json({ error: "Forbidden: role tidak diizinkan" }, { status: 403 }) };
  }
  return { session, error: null };
}

export function getClientIp(req: Request): string {
  const h = req.headers;
  const fwd = h.get("x-forwarded-for");
  if (fwd) return fwd.split(",")[0].trim();
  return h.get("x-real-ip") ?? "unknown";
}

export async function writeLog(opts: { userId?: string | null; ip?: string | null; mac?: string | null; action: string; detail?: string }) {
  try {
    await db.systemLog.create({
      data: { userId: opts.userId ?? null, ip: opts.ip ?? null, mac: opts.mac ?? null, action: opts.action, detail: opts.detail ?? null },
    });
  } catch {
    // jangan gagalkan request utama bila log gagal
  }
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-helpers";

const PAGE_SIZE = 30;

// GET /api/logs?action=&from=&to=&q=&page= — SUPERADMIN + OPERATOR (read), GURU ditolak
export async function GET(req: Request) {
  const { error } = await requireRole(["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB"]);
  if (error) return error;
  const url = new URL(req.url);
  const action = url.searchParams.get("action") || undefined;
  const q = url.searchParams.get("q") || "";
  const from = url.searchParams.get("from");
  const to = url.searchParams.get("to");
  const page = Math.max(1, Number(url.searchParams.get("page") || 1));
  const where = {
    ...(action ? { action } : {}),
    ...((from || to) ? { createdAt: { ...(from ? { gte: new Date(from) } : {}), ...(to ? { lte: new Date(to) } : {}) } } : {}),
    ...(q ? { OR: [{ action: { contains: q } }, { detail: { contains: q } }, { ip: { contains: q } }] } : {}),
  };
  const [total, data, actions] = await Promise.all([
    db.systemLog.count({ where }),
    db.systemLog.findMany({
      where,
      include: { user: { select: { name: true, email: true, role: true } } },
      orderBy: { createdAt: "desc" },
      skip: (page - 1) * PAGE_SIZE,
      take: PAGE_SIZE,
    }),
    db.systemLog.findMany({ select: { action: true }, distinct: ["action"], take: 50 }),
  ]);
  return NextResponse.json({ data, total, page, pageSize: PAGE_SIZE, actions: actions.map((a: { action: string }) => a.action) });
}

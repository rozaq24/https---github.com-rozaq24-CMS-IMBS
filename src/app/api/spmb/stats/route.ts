import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireRole } from "@/lib/auth-helpers";

export async function GET(req: Request) {
  const { error } = await requireRole(["SUPERADMIN", "OPERATOR_SPMB"]); if (error) return error;
  const periodId = new URL(req.url).searchParams.get("periodId") || undefined;
  const where = periodId ? { periodId } : {};
  const [total, byStatus, origins, latest] = await Promise.all([
    db.sPMBApplicant.count({ where }),
    db.sPMBApplicant.groupBy({ by: ["status"], where, _count: { _all: true } }),
    db.sPMBApplicant.groupBy({ by: ["origin"], where, _count: { _all: true }, orderBy: { _count: { origin: "desc" } }, take: 10 }),
    db.sPMBApplicant.findMany({ where: { ...where, createdAt: { gte: new Date(Date.now() - 7 * 86400000) } }, select: { createdAt: true } }),
  ]);
  const daily = Array.from({ length: 7 }, (_, i) => { const day = new Date(); day.setHours(0, 0, 0, 0); day.setDate(day.getDate() - (6 - i)); const key = day.toISOString().slice(0, 10); return { date: key, count: latest.filter((a) => a.createdAt.toISOString().slice(0, 10) === key).length }; });
  return NextResponse.json({ total, byStatus: Object.fromEntries(byStatus.map((x) => [x.status, x._count._all])), origins: origins.map((x) => ({ origin: x.origin || "Tidak disebutkan", count: x._count._all })), daily });
}

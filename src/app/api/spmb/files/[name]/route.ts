import { readFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";

export async function GET(_req: Request, { params }: { params: { name: string } }) {
  const { error } = await requireRole(["SUPERADMIN", "OPERATOR_SPMB"]); if (error) return error;
  if (!/^[0-9a-f-]{36}\.(pdf|jpg)$/.test(params.name)) return new Response("Not found", { status: 404 });
  try {
    const file = await readFile(join(process.cwd(), "storage", "spmb", params.name));
    return new Response(file, { headers: { "Content-Type": params.name.endsWith(".pdf") ? "application/pdf" : "image/jpeg", "Content-Disposition": `inline; filename="${params.name}"`, "Cache-Control": "private, no-store", "X-Content-Type-Options": "nosniff" } });
  } catch { return NextResponse.json({ error: "Berkas tidak ditemukan" }, { status: 404 }); }
}

import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth-helpers";
import { studentTemplate } from "@/lib/excel";

export async function GET() {
  const { error } = await requireRole(["SUPERADMIN", "OPERATOR_SPMB"]);
  if (error) return error;
  return new NextResponse(new Uint8Array(studentTemplate()), { headers: { "Content-Type": "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "Content-Disposition": "attachment; filename=template-import-siswa.xlsx" } });
}

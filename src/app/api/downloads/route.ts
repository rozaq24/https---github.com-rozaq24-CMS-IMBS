import { NextResponse } from "next/server";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { downloadSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_BERITA", "OPERATOR_SPMB"];
const MAX_BYTES = 25 * 1024 * 1024;
const FILES = new Map([
  ["application/pdf", "pdf"], ["application/msword", "doc"], ["application/vnd.openxmlformats-officedocument.wordprocessingml.document", "docx"],
  ["application/vnd.ms-excel", "xls"], ["application/vnd.openxmlformats-officedocument.spreadsheetml.sheet", "xlsx"],
  ["application/vnd.ms-powerpoint", "ppt"], ["application/vnd.openxmlformats-officedocument.presentationml.presentation", "pptx"], ["application/zip", "zip"],
]);

export async function GET() {
  const { error } = await requireRole(ROLES); if (error) return error;
  return NextResponse.json({ data: await db.downloadFile.findMany({ orderBy: { createdAt: "desc" } }) });
}

export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const form = await req.formData().catch(() => null); const file = form?.get("file");
  if (!(file instanceof File) || !file.size || file.size > MAX_BYTES) return NextResponse.json({ error: "Pilih file maksimal 25 MB" }, { status: 400 });
  const ext = FILES.get(file.type); if (!ext) return NextResponse.json({ error: "Format yang diizinkan: PDF, DOC/X, XLS/X, PPT/X, ZIP" }, { status: 400 });
  let raw: unknown;
  try { raw = JSON.parse(String(form?.get("data") || "")); } catch { raw = null; }
  const parsed = downloadSchema.safeParse(raw); if (!parsed.success) return NextResponse.json({ error: "Judul dan kategori file wajib diisi" }, { status: 400 });
  const now = new Date(); const folder = join(process.cwd(), "public", "uploads", "downloads", String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  await mkdir(folder, { recursive: true }); const filename = `${randomUUID()}.${ext}`; const filePath = join(folder, filename); const fileUrl = `/uploads/downloads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${filename}`;
  await writeFile(filePath, Buffer.from(await file.arrayBuffer()));
  try {
    const item = await db.downloadFile.create({ data: { ...parsed.data, desc: parsed.data.desc || null, fileUrl, size: file.size } });
    await writeLog({ userId: session!.user.id, ip: getClientIp(req), action: "DOWNLOAD_UPLOAD", detail: item.title });
    return NextResponse.json(item, { status: 201 });
  } catch {
    await unlink(filePath).catch(() => {});
    return NextResponse.json({ error: "Data file gagal disimpan" }, { status: 500 });
  }
}

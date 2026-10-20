import { NextResponse } from "next/server";
import { writeFile, mkdir } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";
import { requireRole } from "@/lib/auth-helpers";

const MAX_MB = 5;
const ALLOWED = new Map([
  ["image/jpeg", "jpg"], ["image/png", "png"], ["image/webp", "webp"], ["image/gif", "gif"],
]);

// POST /api/upload — OPERATOR_BERITA / SUPERADMIN. FormData { file }
export async function POST(req: Request) {
  const { error } = await requireRole(["SUPERADMIN", "OPERATOR_BERITA"]);
  if (error) return error;
  const form = await req.formData().catch(() => null);
  const file = form?.get("file") as File | null;
  if (!file || typeof file === "string") return NextResponse.json({ error: "File wajib diunggah" }, { status: 400 });
  const ext = ALLOWED.get(file.type);
  if (!ext) return NextResponse.json({ error: "Hanya JPG/PNG/WebP/GIF yang diizinkan" }, { status: 400 });
  if (file.size > MAX_MB * 1024 * 1024) return NextResponse.json({ error: `Maksimal ${MAX_MB}MB` }, { status: 400 });
  const now = new Date();
  const dir = join(process.cwd(), "public", "uploads", String(now.getFullYear()), String(now.getMonth() + 1).padStart(2, "0"));
  await mkdir(dir, { recursive: true });
  const name = `${randomUUID()}.${ext}`;
  const buf = Buffer.from(await file.arrayBuffer());
  await writeFile(join(dir, name), buf);
  const url = `/uploads/${now.getFullYear()}/${String(now.getMonth() + 1).padStart(2, "0")}/${name}`;
  return NextResponse.json({ url, size: file.size }, { status: 201 });
}

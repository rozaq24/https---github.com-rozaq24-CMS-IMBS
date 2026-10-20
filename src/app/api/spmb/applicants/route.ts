import { randomUUID } from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";
import { join } from "path";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { allowRequest } from "@/lib/rate-limit";
import { getClientIp, requireRole } from "@/lib/auth-helpers";
import { spmbSchema } from "@/lib/validators";

const ROLES = ["SUPERADMIN", "OPERATOR_SPMB"];
const MAX_FILE = 8 * 1024 * 1024;
const ACCEPTED: Record<string, { ext: string; matches: (bytes: Uint8Array) => boolean }> = {
  "application/pdf": { ext: "pdf", matches: (b) => new TextDecoder().decode(b.slice(0, 5)) === "%PDF-" },
  "image/jpeg": { ext: "jpg", matches: (b) => b[0] === 0xff && b[1] === 0xd8 && b[2] === 0xff },
};

export async function GET(req: Request) {
  const { error } = await requireRole(ROLES); if (error) return error;
  const url = new URL(req.url); const periodId = url.searchParams.get("periodId") || undefined;
  const status = url.searchParams.get("status") || undefined;
  if (status && !["PENDING", "VERIFIED", "REJECTED", "ACCEPTED"].includes(status)) return NextResponse.json({ error: "Filter status tidak valid" }, { status: 400 });
  const csv = url.searchParams.get("format") === "csv";
  const data = await db.sPMBApplicant.findMany({ where: { ...(periodId ? { periodId } : {}), ...(status ? { status } : {}) }, include: { period: { select: { name: true, year: true } } }, orderBy: { createdAt: "desc" }, ...(csv ? {} : { take: 1000 }) });
  if (csv) {
    const cell = (value: unknown) => `"${String(value ?? "").replace(/[\r\n]/g, " ").replace(/"/g, '""').replace(/^\s*[=+@-]/, "'$&")}"`;
    const rows = [["Kode", "Nama", "NIK", "Email", "Telepon", "Asal Sekolah", "Orang Tua", "Periode", "Status", "Catatan", "Tanggal"], ...data.map((a) => [a.code, a.name, a.nik, a.email, a.phone, a.origin, a.parentName, `${a.period.name} ${a.period.year}`, a.status, a.note, a.createdAt.toISOString()])];
    return new Response(`\ufeff${rows.map((row) => row.map(cell).join(",")).join("\r\n")}`, { headers: { "Content-Type": "text/csv; charset=utf-8", "Content-Disposition": "attachment; filename=spmb-pendaftar.csv" } });
  }
  return NextResponse.json({ data });
}

export async function POST(req: Request) {
  const ip = getClientIp(req); if (!allowRequest(`spmb:${ip}`, 4)) return NextResponse.json({ error: "Terlalu banyak percobaan. Coba kembali dalam satu menit." }, { status: 429 });
  const form = await req.formData().catch(() => null);
  if (!form) return NextResponse.json({ error: "Formulir tidak valid" }, { status: 400 });
  const parsed = spmbSchema.safeParse(Object.fromEntries(["periodId", "name", "nik", "email", "phone", "origin", "parentName"].map((key) => [key, form.get(key) ?? ""])));
  if (!parsed.success) return NextResponse.json({ error: "Periksa kembali biodata pendaftar", issues: parsed.error.flatten() }, { status: 400 });
  const fileKeys = ["document1", "document2", "document3"];
  const files = fileKeys.map((key) => form.get(key));
  if (!files.some((file) => file instanceof File && file.size > 0)) return NextResponse.json({ error: "Unggah minimal satu berkas. Berkas yang kurang dapat dilengkapi melalui operator." }, { status: 400 });
  const uploads: { key: string; file: File; ext: string }[] = [];
  for (let index = 0; index < files.length; index++) {
    const item = files[index];
    if (!(item instanceof File) || item.size === 0) continue;
    const type = ACCEPTED[item.type];
    if (!type || item.size > MAX_FILE) return NextResponse.json({ error: "Berkas harus PDF/JPG maksimal 8 MB." }, { status: 400 });
    const bytes = new Uint8Array(await item.arrayBuffer());
    if (!type.matches(bytes)) return NextResponse.json({ error: "Isi berkas tidak sesuai dengan tipe PDF/JPG." }, { status: 400 });
    uploads.push({ key: fileKeys[index], file: item, ext: type.ext });
  }
  const period = await db.sPMBPeriod.findFirst({ where: { id: parsed.data.periodId, active: true } });
  const now = new Date();
  if (!period || now < period.openAt || now > period.closeAt) return NextResponse.json({ error: "Periode pendaftaran sedang tutup." }, { status: 409 });
  const duplicate = await db.sPMBApplicant.findFirst({ where: { periodId: period.id, OR: [{ nik: parsed.data.nik }, ...(parsed.data.email ? [{ email: parsed.data.email.toLowerCase() }] : [])] } });
  if (duplicate) return NextResponse.json({ error: "NIK atau email sudah terdaftar pada periode ini." }, { status: 409 });
  const count = await db.sPMBApplicant.count({ where: { periodId: period.id } });
  if (count >= period.quota) return NextResponse.json({ error: "Kuota pendaftaran pada periode ini sudah terpenuhi." }, { status: 409 });

  const dir = join(process.cwd(), "storage", "spmb"); await mkdir(dir, { recursive: true });
  const saved: string[] = [];
  try {
    const paths: Record<string, string> = {};
    for (const { key, file, ext } of uploads) { const name = `${randomUUID()}.${ext}`; await writeFile(join(dir, name), Buffer.from(await file.arrayBuffer()), { flag: "wx" }); saved.push(name); paths[key] = `/api/spmb/files/${name}`; }
    const applicant = await db.$transaction(async (tx) => {
      const count = await tx.sPMBApplicant.count({ where: { periodId: period.id } });
      if (count >= period.quota) throw new Error("QUOTA_FULL");
      return tx.sPMBApplicant.create({ data: { ...parsed.data, email: parsed.data.email.toLowerCase() || null, code: `IMBS-${new Date().getFullYear()}-${randomUUID().slice(0, 8).toUpperCase()}`, files: JSON.stringify(paths) } });
    });
    return NextResponse.json({ code: applicant.code, message: "Pendaftaran berhasil. Simpan kode untuk mengecek status." }, { status: 201 });
  } catch (cause) {
    await Promise.all(saved.map((name) => unlink(join(dir, name)).catch(() => undefined)));
    const code = (cause as { code?: string })?.code;
    const full = (cause as Error)?.message === "QUOTA_FULL";
    return NextResponse.json({ error: full ? "Kuota pendaftaran pada periode ini sudah terpenuhi." : code === "P2002" ? "NIK atau email sudah terdaftar pada periode ini." : "Pendaftaran gagal disimpan. Coba lagi." }, { status: full || code === "P2002" ? 409 : 500 });
  }
}

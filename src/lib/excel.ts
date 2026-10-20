import * as XLSX from "xlsx";
import { z } from "zod";

const importSchema = z.object({
  nis: z.string().trim().min(1, "NIS wajib diisi").max(30),
  nisn: z.string().trim().max(30).optional(),
  name: z.string().trim().min(3, "Nama minimal 3 karakter").max(120),
  gender: z.enum(["L", "P"]).optional(),
  className: z.string().trim().min(1, "Kelas wajib diisi"),
  year: z.string().trim().max(20).optional(),
  status: z.enum(["AKTIF", "LULUS", "PINDAH", "KELUAR"]).default("AKTIF"),
});

export type ImportClass = { id: string; name: string; year: string };
export type ImportPreview = { row: number; data: { nis: string; nisn?: string; name: string; gender?: "L" | "P"; classId: string; year: string; status: "AKTIF" | "LULUS" | "PINDAH" | "KELUAR" } | null; errors: string[] };

export function parseStudentWorkbook(buffer: Buffer, classes: ImportClass[], existingNis: Set<string>): ImportPreview[] {
  const workbook = XLSX.read(buffer, { type: "buffer" });
  const sheet = workbook.Sheets[workbook.SheetNames[0]];
  if (!sheet) return [];
  const rows = XLSX.utils.sheet_to_json<Record<string, unknown>>(sheet, { defval: "", raw: false });
  if (rows.length > 5000) throw new Error("Maksimal 5.000 baris per impor");
  const byName = new Map(classes.map((c) => [c.name.toLocaleLowerCase(), c]));
  const seen = new Set<string>();
  return rows.flatMap<ImportPreview>((raw, index) => {
    const normalized = Object.fromEntries(Object.entries(raw).map(([key, value]) => [key.trim().toLocaleLowerCase(), String(value ?? "").trim()]));
    if (Object.values(normalized).every((value) => !value)) return [];
    const candidate = {
      nis: normalized.nis || "", nisn: normalized.nisn || undefined, name: normalized.nama || "",
      gender: (normalized["jenis kelamin"] || "").toUpperCase() || undefined,
      className: normalized.kelas || "", year: normalized.tahun || undefined,
      status: (normalized.status || "AKTIF").toUpperCase(),
    };
    const parsed = importSchema.safeParse(candidate);
    const errors = parsed.success ? [] : parsed.error.issues.map((issue) => `${issue.path.join(".")}: ${issue.message}`);
    const nis = candidate.nis;
    if (nis && (existingNis.has(nis) || seen.has(nis))) errors.push(`NIS ${nis} duplikat`);
    if (nis) seen.add(nis);
    const classroom = byName.get(candidate.className.toLocaleLowerCase());
    if (candidate.className && !classroom) errors.push(`Kelas "${candidate.className}" tidak ditemukan`);
    if (!parsed.success || !classroom || errors.length) return [{ row: index + 2, data: null, errors }];
    const v = parsed.data;
    return [{ row: index + 2, data: { nis: v.nis, nisn: v.nisn || undefined, name: v.name, gender: v.gender, classId: classroom.id, year: v.year || classroom.year, status: v.status }, errors: [] }];
  });
}

export function studentTemplate(): Buffer {
  const sheet = XLSX.utils.aoa_to_sheet([["NIS", "NISN", "Nama", "Jenis Kelamin", "Kelas", "Tahun", "Status"], ["12345", "0012345678", "Nama Siswa", "L", "X RPL 1", "2026/2027", "AKTIF"]]);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, sheet, "Siswa");
  return XLSX.write(workbook, { type: "buffer", bookType: "xlsx" });
}

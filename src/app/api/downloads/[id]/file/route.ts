import { NextResponse } from "next/server";
import { readFile } from "fs/promises";
import { extname, join } from "path";
import { db } from "@/lib/db";
import { getClientIp, writeLog } from "@/lib/auth-helpers";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const item = await db.downloadFile.findUnique({ where: { id: params.id } });
  if (!item || !item.public || !item.fileUrl.startsWith("/uploads/downloads/")) return NextResponse.json({ error: "File tidak ditemukan" }, { status: 404 });
  let content: Buffer;
  try { content = await readFile(join(process.cwd(), "public", item.fileUrl.slice(1))); }
  catch { return NextResponse.json({ error: "File tidak tersedia" }, { status: 404 }); }
  const updated = await db.downloadFile.update({ where: { id: item.id }, data: { downloads: { increment: 1 } } });
  await writeLog({ ip: getClientIp(req), action: "DOWNLOAD_FILE", detail: `${item.title} (${updated.downloads})` });
  const extension = extname(item.fileUrl); const filename = encodeURIComponent(`${item.title}${extension}`);
  return new NextResponse(new Uint8Array(content), { headers: { "Content-Type": "application/octet-stream", "Content-Disposition": `attachment; filename*=UTF-8''${filename}`, "Content-Length": String(content.length) } });
}

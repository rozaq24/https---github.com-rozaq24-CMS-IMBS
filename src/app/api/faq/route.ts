import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { FAQ } from "@/lib/faq";

export const dynamic = "force-dynamic";
export async function GET() {
  const setting = await db.siteSetting.findUnique({ where: { key: "site.faq" } });
  try {
    const items: unknown = setting ? JSON.parse(setting.value) : FAQ;
    if (Array.isArray(items) && items.every((item) => item && typeof item.question === "string" && typeof item.answer === "string" && typeof item.href === "string" && item.href.startsWith("/"))) return NextResponse.json({ items });
  } catch { /* pakai FAQ bawaan */ }
  return NextResponse.json({ items: FAQ });
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { buildMenuTree, validateMenuTree } from "@/lib/menus";
import { menuSchema } from "@/lib/validators";
const ROLES = ["SUPERADMIN", "OPERATOR_BERITA"];
export async function GET(req: Request) {
  const admin = new URL(req.url).searchParams.get("admin") === "1";
  if (admin) { const { error } = await requireRole(ROLES); if (error) return error; const [data,pages]=await Promise.all([db.menuItem.findMany({orderBy:{order:"asc"}}),db.customPage.findMany({select:{id:true,slug:true,title:true},orderBy:{order:"asc"}})]); return NextResponse.json({data,pages}); }
  const items = await db.menuItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
  return NextResponse.json({ data: buildMenuTree(items) });
}
export async function POST(req: Request) {
  const { error, session } = await requireRole(ROLES); if (error) return error;
  const parsed = menuSchema.safeParse(await req.json().catch(() => null)); if (!parsed.success) return NextResponse.json({ error: "Data menu tidak valid", issues: parsed.error.flatten() }, { status: 400 });
  const v=parsed.data; const items=await db.menuItem.findMany({select:{id:true,parentId:true}});
  try { validateMenuTree([...items,{id:"__new_menu__",parentId:v.parentId||null}]); } catch(e) { return NextResponse.json({error:e instanceof Error?e.message:"Struktur menu tidak valid"},{status:400}); }
  if(v.pageSlug && !(await db.customPage.findUnique({where:{slug:v.pageSlug},select:{id:true}}))) return NextResponse.json({error:"Halaman tidak ditemukan"},{status:400});
  const parentId=v.parentId||null;
  const siblingOrders=await db.menuItem.findMany({where:{parentId},select:{order:true}});
  const nextOrder=siblingOrders.length?Math.max(...siblingOrders.map(x=>x.order))+1:0;
  const item=await db.menuItem.create({data:{...v,order:nextOrder,href:v.pageSlug?`/${v.pageSlug}`:v.href,parentId}});
  await writeLog({userId:session!.user.id,ip:getClientIp(req),action:"MENU_CREATE",detail:item.label}); return NextResponse.json(item,{status:201});
}

import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { customPageMenuHref, validateMenuTree } from "@/lib/menus";
import { menuSchema } from "@/lib/validators";
const ROLES=["SUPERADMIN","OPERATOR_BERITA"];
export async function PATCH(req:Request,{params}:{params:{id:string}}){
 const {error,session}=await requireRole(ROLES);if(error)return error;const parsed=menuSchema.partial().safeParse(await req.json().catch(()=>null));if(!parsed.success)return NextResponse.json({error:"Data menu tidak valid",issues:parsed.error.flatten()},{status:400});
 const items=await db.menuItem.findMany();const target=items.find(x=>x.id===params.id);if(!target)return NextResponse.json({error:"Menu tidak ditemukan"},{status:404});const v=parsed.data;
 try{validateMenuTree(items.map(x=>({id:x.id,parentId:x.id===params.id?(v.parentId===undefined?x.parentId:v.parentId):x.parentId})));}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Struktur menu tidak valid"},{status:400});}
 if(v.pageSlug&&!(await db.customPage.findUnique({where:{slug:v.pageSlug},select:{id:true}})))return NextResponse.json({error:"Halaman tidak ditemukan"},{status:400});
 const href=v.pageSlug?customPageMenuHref(v.pageSlug,v.href??target.href):undefined;if(v.pageSlug&&!href)return NextResponse.json({error:"ID anchor hanya boleh berisi huruf kecil, angka, dan tanda hubung"},{status:400});
 const item=await db.menuItem.update({where:{id:params.id},data:{...v,...(href?{href}:{})}});await writeLog({userId:session!.user.id,ip:getClientIp(req),action:"MENU_UPDATE",detail:item.label});return NextResponse.json(item);
}
export async function DELETE(req:Request,{params}:{params:{id:string}}){const {error,session}=await requireRole(ROLES);if(error)return error;const item=await db.menuItem.findUnique({where:{id:params.id}});if(!item)return NextResponse.json({error:"Menu tidak ditemukan"},{status:404});await db.menuItem.delete({where:{id:params.id}});await writeLog({userId:session!.user.id,ip:getClientIp(req),action:"MENU_DELETE",detail:item.label});return NextResponse.json({ok:true});}

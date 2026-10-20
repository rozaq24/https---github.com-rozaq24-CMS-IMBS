import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { validateMenuTree } from "@/lib/menus";

export async function POST(req:Request){
 const {error,session}=await requireRole(["SUPERADMIN","OPERATOR_BERITA"]);if(error)return error;const body=await req.json().catch(()=>null);
 if(!Array.isArray(body?.items)||body.items.some((x:unknown)=>!x||typeof x!=="object"||typeof (x as {id?:unknown}).id!=="string"||!((x as {parentId?:unknown}).parentId===null||typeof (x as {parentId?:unknown}).parentId==="string")||!Number.isInteger((x as {order?:unknown}).order)))return NextResponse.json({error:"Daftar urutan menu tidak valid"},{status:400});
 const existing=await db.menuItem.findMany({select:{id:true}});if(existing.length!==body.items.length||existing.some(x=>!body.items.some((m:{id:string})=>m.id===x.id)))return NextResponse.json({error:"Muat ulang menu sebelum menyimpan susunan"},{status:409});
 try{validateMenuTree(body.items);}catch(e){return NextResponse.json({error:e instanceof Error?e.message:"Struktur menu tidak valid"},{status:400});}
 await db.$transaction(body.items.map((item:{id:string;parentId:string|null;order:number})=>db.menuItem.update({where:{id:item.id},data:{parentId:item.parentId,order:item.order}})));
 await writeLog({userId:session!.user.id,ip:getClientIp(req),action:"MENU_REORDER",detail:`${body.items.length} menu`});return NextResponse.json({ok:true});
}

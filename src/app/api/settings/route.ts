import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { getClientIp, requireRole, writeLog } from "@/lib/auth-helpers";
import { getSiteSettings } from "@/lib/settings";
import { settingsUpdateSchema } from "@/lib/validators";

export const dynamic = "force-dynamic";
export async function GET(){return NextResponse.json(await getSiteSettings())}
export async function PATCH(req:Request){
 const {error,session}=await requireRole(["SUPERADMIN"]);if(error)return error;
 const parsed=settingsUpdateSchema.safeParse(await req.json().catch(()=>null));if(!parsed.success||(!parsed.data?.theme&&!parsed.data?.identity))return NextResponse.json({error:"Pengaturan tidak valid",issues:parsed.success?undefined:parsed.error.flatten()},{status:400});
 if(parsed.data.theme)await db.siteSetting.upsert({where:{key:"site.theme"},create:{key:"site.theme",value:parsed.data.theme},update:{value:parsed.data.theme}});
 if(parsed.data.identity){const current=await getSiteSettings();const identity={...current.identity,...parsed.data.identity};await db.siteSetting.upsert({where:{key:"site.identity"},create:{key:"site.identity",value:JSON.stringify(identity)},update:{value:JSON.stringify(identity)}})}
 await writeLog({userId:session!.user.id,ip:getClientIp(req),action:"SITE_SETTINGS_UPDATE",detail:Object.keys(parsed.data).join(",")});revalidatePath("/","layout");return NextResponse.json(await getSiteSettings());
}

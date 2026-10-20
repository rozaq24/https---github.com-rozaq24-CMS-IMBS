import { db } from "@/lib/db";
import type { ThemeName } from "@/lib/theme";

export type SiteIdentity={siteTitle:string;description:string;keywords:string;logo:string;favicon:string;address:string;phone:string;email:string;mapUrl:string;facebook:string;instagram:string;youtube:string};
export const DEFAULT_IDENTITY:SiteIdentity={siteTitle:"CMS IMBS",description:"Profil, berita, akademik, dan layanan sekolah.",keywords:"sekolah, IMBS, pendidikan",logo:"",favicon:"",address:"",phone:"",email:"",mapUrl:"",facebook:"",instagram:"",youtube:""};

export async function getSiteSettings():Promise<{theme:ThemeName;identity:SiteIdentity}>{
  const rows=await db.siteSetting.findMany({where:{key:{in:["site.theme","site.identity"]}}});
  const themeValue=rows.find(x=>x.key==="site.theme")?.value as ThemeName|undefined;
  const identityValue=rows.find(x=>x.key==="site.identity")?.value;
  let identity:Partial<SiteIdentity>={};try{identity=identityValue?JSON.parse(identityValue):{}}catch{}
  const themes=["emerald","blue","indigo","violet","rose","orange","teal","cyan","lime","slate"];
  return {theme:themes.includes(themeValue||"")?themeValue!:"emerald",identity:{...DEFAULT_IDENTITY,...identity}};
}

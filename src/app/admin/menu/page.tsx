import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { MenuBuilder } from "@/components/MenuBuilder";
import { Card } from "@/components/ui/card";

export default async function MenuAdmin(){const session=await getServerSession(authOptions);if(!session?.user)redirect("/admin/login?callbackUrl=/admin/menu");if(!hasRole(session.user.role,["SUPERADMIN","OPERATOR_BERITA"]))return <main className="mx-auto max-w-6xl p-[34px]"><Card className="">Akses menu ditolak.</Card></main>;return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><header><h1 className="h-gold-1">Menu <span className="grad-text">Navigasi</span></h1><p className="text-slate-500 mt-[8px]">Susun menu hingga tiga tingkat; tautkan ke halaman statis atau URL.</p></header><MenuBuilder/></main>}

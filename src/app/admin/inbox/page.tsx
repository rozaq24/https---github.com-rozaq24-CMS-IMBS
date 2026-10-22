import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { InboxClient } from "./inbox-client";
import { Card } from "@/components/ui/card";

export default async function InboxAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/inbox");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) return <main className="mx-auto max-w-6xl p-[34px]"><Card className="">Akses inbox ditolak.</Card></main>;
  return <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]"><h1 className="h-gold-1">Kotak <span className="grad-text">Masuk</span></h1><InboxClient /></main>;
}

import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { PageForm } from "../page-form";

export default async function NewPageAdmin() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/pages/baru");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) redirect("/admin/pages");
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">Halaman <span className="grad-text">Baru</span></h1>
      <PageForm />
    </main>
  );
}

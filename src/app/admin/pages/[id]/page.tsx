import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { PageForm } from "../page-form";

export default async function EditPageAdmin({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/admin/login?callbackUrl=/admin/pages/${params.id}`);
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) redirect("/admin/pages");
  const page = await db.customPage.findUnique({ where: { id: params.id } });
  if (!page) notFound();
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">Edit <span className="grad-text">Halaman</span></h1>
      <PageForm initial={{ id: page.id, title: page.title, slug: page.slug, content: page.content, showInMenu: page.showInMenu, order: page.order }} />
    </main>
  );
}

import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { BuilderClient } from "../builder-client";

export default async function EditBuilderPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/admin/login?callbackUrl=/admin/builder/${params.id}`);
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) redirect("/admin");
  const page = await db.customPage.findUnique({ where: { id: params.id }, select: { id: true, title: true, slug: true, showInMenu: true, order: true, builderData: true } });
  if (!page) notFound();
  return <main><BuilderClient initial={page} pageId={page.id} /></main>;
}

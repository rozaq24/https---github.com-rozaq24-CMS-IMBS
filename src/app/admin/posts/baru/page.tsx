import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { PostForm } from "../post-form";

export default async function NewPostPage() {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect("/admin/login?callbackUrl=/admin/posts/baru");
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) redirect("/admin/posts");
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">Tulis <span className="grad-text">Post Baru</span></h1>
      <PostForm />
    </main>
  );
}

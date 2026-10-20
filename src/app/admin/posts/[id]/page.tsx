import { getServerSession } from "next-auth";
import { notFound, redirect } from "next/navigation";
import { authOptions, hasRole } from "@/lib/auth";
import { db } from "@/lib/db";
import { PostForm } from "../post-form";

export default async function EditPostPage({ params }: { params: { id: string } }) {
  const session = await getServerSession(authOptions);
  if (!session?.user) redirect(`/admin/login?callbackUrl=/admin/posts/${params.id}`);
  if (!hasRole(session.user.role, ["SUPERADMIN", "OPERATOR_BERITA"])) redirect("/admin/posts");
  const post = await db.post.findUnique({ where: { id: params.id } });
  if (!post) notFound();
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">Edit <span className="grad-text">Post</span></h1>
      <PostForm initial={{ id: post.id, title: post.title, slug: post.slug, excerpt: post.excerpt || "", content: post.content, cover: post.cover, type: post.type, status: post.status, publishedAt: post.publishedAt?.toISOString() || null }} />
    </main>
  );
}

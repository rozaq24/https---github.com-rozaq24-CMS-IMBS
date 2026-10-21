import { AdminShell } from "./admin-shell";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await getServerSession(authOptions);
  const user = session?.user ? { name: session.user.name || "Admin", role: session.user.role } : undefined;
  return <AdminShell user={user}>{children}</AdminShell>;
}

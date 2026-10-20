import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { SignOutButton } from "./signout-button";

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  const menus: [string, string, string][] = [
    ["posts", "Posting", "T-003"], ["pages", "Halaman", "T-004"], ["galeri", "Galeri", "T-005"],
    ["gtk", "GTK", "T-006"], ["siswa", "Siswa", "T-007"], ["spmb", "SPMB", "T-011"],
    ["menu", "Menu", "T-009"], ["tema", "Tema", "T-010"], ["users", "Users", "T-002"], ["logs", "System Log", "T-002"],
  ];
  return (
    <main className="mx-auto max-w-6xl px-[21px] py-[34px] space-y-[21px]">
      <div className="card flex items-center justify-between flex-wrap gap-[13px]">
        <div>
          <h1 className="h-gold-1">Dashboard Admin <span className="grad-text">IMBS</span></h1>
          <p className="text-slate-500 mt-[8px]">
            {session?.user ? <>Login sebagai <b>{session.user.name}</b> ({session.user.email}) — role <b>{session.user.role}</b></> : "Belum login"}
          </p>
        </div>
        <SignOutButton />
      </div>
      <div className="grid md:grid-cols-3 gap-[21px]">
        {menus.map(([href, label, tag]) => (
          <Link key={href} href={`/admin/${href}`} className="card hover:shadow-xl transition">
            <h2 className="h-gold-3">{label}</h2>
            <p className="text-[13px] text-slate-500 mt-[8px]">/admin/{href} → {tag}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}


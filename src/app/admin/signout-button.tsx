"use client";
import { signOut } from "next-auth/react";

export function SignOutButton() {
  return <button className="btn-outline !py-[8px]" onClick={() => signOut({ callbackUrl: "/admin/login" })}>Keluar</button>;
}

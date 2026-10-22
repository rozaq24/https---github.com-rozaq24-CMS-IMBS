"use client";
import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";

export function SignOutButton() {
  return <Button className="!py-[8px]" onClick={() => signOut({ callbackUrl: "/admin/login" })} variant="outline">Keluar</Button>;
}

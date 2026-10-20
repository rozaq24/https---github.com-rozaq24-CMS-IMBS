import type { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { db } from "./db";

declare module "next-auth" {
  interface Session {
    user: { id: string; name?: string | null; email?: string | null; role: string };
  }
}
declare module "next-auth/jwt" {
  interface JWT { id?: string; role?: string }
}

function getIpFromHeaders(h: Record<string, string | string[] | undefined>): string {
  const fwd = h["x-forwarded-for"];
  if (typeof fwd === "string" && fwd.length > 0) return fwd.split(",")[0].trim();
  const real = h["x-real-ip"];
  if (typeof real === "string" && real.length > 0) return real;
  return "unknown";
}

export const authOptions: NextAuthOptions = {
  session: { strategy: "jwt" },
  providers: [
    Credentials({
      name: "Login Admin",
      credentials: {
        email: { label: "Email" },
        password: { label: "Password", type: "password" },
        mac: { label: "MAC" },
      },
      async authorize(creds, req) {
        if (!creds?.email || !creds?.password) return null;
        const user = await db.user.findUnique({ where: { email: creds.email } });
        const headers = (req?.headers ?? {}) as Record<string, string | string[] | undefined>;
        const ip = getIpFromHeaders(headers);
        const mac = typeof creds.mac === "string" ? creds.mac.slice(0, 32) : null;
        if (!user || !user.active) {
          await db.systemLog.create({
            data: { userId: user?.id ?? null, ip, mac, action: "LOGIN_FAILED", detail: creds.email },
          });
          return null;
        }
        const ok = await bcrypt.compare(creds.password, user.passwordHash);
        if (!ok) {
          await db.systemLog.create({
            data: { userId: user.id, ip, mac, action: "LOGIN_FAILED", detail: user.email },
          });
          return null;
        }
        await db.user.update({ where: { id: user.id }, data: { lastLoginAt: new Date() } });
        await db.systemLog.create({
          data: { userId: user.id, ip, mac, action: "LOGIN", detail: user.email },
        });
        return { id: user.id, name: user.name, email: user.email, role: user.role } as never;
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = (user as { id: string }).id;
        token.role = (user as unknown as { role: string }).role;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = (token.id as string) ?? "";
        session.user.role = (token.role as string) ?? "";
      }
      return session;
    },
  },
  pages: { signIn: "/admin/login" },
};

export function hasRole(userRole: string | undefined, allowed: string[]): boolean {
  if (!userRole) return false;
  if (userRole === "SUPERADMIN") return true;
  return allowed.includes(userRole);
}


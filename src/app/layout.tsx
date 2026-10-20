import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "CMS IMBS — Website Sekolah",
  description: "CMS sekolah: profil, berita, akademik, SPMB. Lihat AGENTS.md.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="id" data-theme="emerald">
      <body><Providers>{children}</Providers></body>
    </html>
  );
}


import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { identity } = await getSiteSettings();
  const title = identity.siteTitle;
  return {
    title: { default: title, template: `%s | ${title}` },
    description: identity.description,
    keywords: identity.keywords.split(",").map((value) => value.trim()).filter(Boolean),
    icons: identity.favicon || undefined,
    openGraph: { title, description: identity.description, type: "website" },
  };
}

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const { theme } = await getSiteSettings();
  return (
    <html lang="id" data-theme={theme}>
      <body><Providers>{children}</Providers></body>
    </html>
  );
}

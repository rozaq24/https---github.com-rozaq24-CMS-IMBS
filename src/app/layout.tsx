import type { Metadata } from "next";
import "./globals.css";
import "@/components/echo/echo-theme.css";
import { Providers } from "./providers";
import { getSiteSettings } from "@/lib/settings";
import { EchoCheck } from "echo-ui-core/check";
import { Montserrat, Playfair_Display } from "next/font/google";

const montserrat = Montserrat({ subsets: ["latin"], variable: "--font-body", display: "swap" });
const playfair = Playfair_Display({ subsets: ["latin"], variable: "--font-display", display: "swap" });

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { identity } = await getSiteSettings();
  const title = identity.siteTitle;
  return {
    metadataBase: new URL(process.env.NEXTAUTH_URL || "http://localhost:3000"),
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
      <body className={`${montserrat.variable} ${playfair.variable}`}>
        <Providers>
          <EchoCheck />
          {children}
        </Providers>
      </body>
    </html>
  );
}

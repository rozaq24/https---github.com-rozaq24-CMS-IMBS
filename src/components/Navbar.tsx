import { db } from "@/lib/db";
import { buildPublicMenu } from "@/lib/menus";
import { NavbarClient } from "@/components/NavbarClient";
import type { SiteIdentity } from "@/lib/settings";

export async function Navbar({ identity }: { identity: SiteIdentity }) {
  const [items, pages] = await Promise.all([
    db.menuItem.findMany({ orderBy: { order: "asc" } }),
    db.customPage.findMany({ where: { showInMenu: true }, select: { slug: true, title: true }, orderBy: [{ order: "asc" }, { title: "asc" }] }),
  ]);
  return <NavbarClient items={buildPublicMenu(items, pages)} title={identity.siteTitle} logo={identity.logo} identity={identity} />;
}

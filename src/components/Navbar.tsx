import { db } from "@/lib/db";
import { buildMenuTree } from "@/lib/menus";
import { NavbarClient } from "@/components/NavbarClient";
import { getSiteSettings } from "@/lib/settings";

export async function Navbar() {
  const [items, settings] = await Promise.all([db.menuItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } }), getSiteSettings()]);
  return <NavbarClient items={buildMenuTree(items)} title={settings.identity.siteTitle} logo={settings.identity.logo} />;
}

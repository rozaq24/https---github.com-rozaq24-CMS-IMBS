import { db } from "@/lib/db";
import { buildMenuTree } from "@/lib/menus";
import { NavbarClient } from "@/components/NavbarClient";
import type { SiteIdentity } from "@/lib/settings";

export async function Navbar({ identity }: { identity: SiteIdentity }) {
  const items = await db.menuItem.findMany({ where: { visible: true }, orderBy: { order: "asc" } });
  return <NavbarClient items={buildMenuTree(items)} title={identity.siteTitle} logo={identity.logo} identity={identity} />;
}

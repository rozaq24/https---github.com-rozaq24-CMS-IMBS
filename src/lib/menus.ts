export type MenuNode = { id: string; label: string; href: string; pageSlug: string | null; parentId: string | null; order: number; visible: boolean; target: string; children?: MenuNode[] };

export function validateMenuTree(items: { id: string; parentId: string | null }[]) {
  const parents = new Map(items.map((item) => [item.id, item.parentId]));
  if (parents.size !== items.length) throw new Error("ID menu duplikat");
  for (const item of items) {
    const seen = new Set<string>(); let id: string | null = item.id; let depth = 0;
    while (id) {
      if (seen.has(id)) throw new Error("Relasi menu membentuk circular parent");
      seen.add(id); depth++;
      if (!parents.has(id)) throw new Error("Parent menu tidak ditemukan");
      id = parents.get(id) ?? null;
    }
    if (depth > 3) throw new Error("Menu maksimal 3 level");
  }
}

export function buildMenuTree(items: MenuNode[], parentId: string | null = null): MenuNode[] {
  return items.filter((item) => item.parentId === parentId && item.visible).sort((a, b) => a.order - b.order).map((item) => ({ ...item, children: buildMenuTree(items, item.id) }));
}

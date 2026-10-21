export type MenuNode = { id: string; label: string; href: string; pageSlug: string | null; parentId: string | null; order: number; visible: boolean; target: string; children?: MenuNode[] };

export const DEFAULT_PUBLIC_MENU: Omit<MenuNode, "children">[] = [
  { id: "menu-profil", label: "Profil", href: "/profil", pageSlug: null, parentId: null, order: 0, visible: true, target: "_self" },
  { id: "menu-visi", label: "Visi-Misi", href: "/visi-misi", pageSlug: "visi-misi", parentId: "menu-profil", order: 0, visible: true, target: "_self" },
  { id: "menu-sejarah", label: "Sejarah", href: "/sejarah", pageSlug: "sejarah", parentId: "menu-profil", order: 1, visible: true, target: "_self" },
  { id: "menu-tentang", label: "Sambutan", href: "/sambutan", pageSlug: null, parentId: "menu-profil", order: 2, visible: true, target: "_self" },
  { id: "menu-guru", label: "Guru & Tendik", href: "/guru", pageSlug: null, parentId: "menu-profil", order: 3, visible: true, target: "_self" },
  { id: "menu-program", label: "Akademik", href: "/program", pageSlug: null, parentId: null, order: 1, visible: true, target: "_self" },
  { id: "menu-ekskul", label: "Ekstrakurikuler", href: "/ekstrakurikuler", pageSlug: null, parentId: "menu-program", order: 0, visible: true, target: "_self" },
  { id: "menu-prestasi", label: "Prestasi", href: "/prestasi", pageSlug: null, parentId: "menu-program", order: 1, visible: true, target: "_self" },
  { id: "menu-berita", label: "Informasi", href: "/berita", pageSlug: null, parentId: null, order: 2, visible: true, target: "_self" },
  { id: "menu-agenda", label: "Agenda", href: "/agenda", pageSlug: null, parentId: "menu-berita", order: 0, visible: true, target: "_self" },
  { id: "menu-galeri", label: "Galeri", href: "/galeri", pageSlug: null, parentId: "menu-berita", order: 1, visible: true, target: "_self" },
  { id: "menu-download", label: "Unduhan", href: "/download", pageSlug: null, parentId: "menu-berita", order: 2, visible: true, target: "_self" },
  { id: "menu-faq", label: "FAQ", href: "/faq", pageSlug: null, parentId: "menu-berita", order: 3, visible: true, target: "_self" },
  { id: "menu-spmb", label: "SPMB", href: "/spmb", pageSlug: null, parentId: null, order: 3, visible: true, target: "_self" },
  { id: "menu-elearning", label: "E-Learning", href: "/e-learning", pageSlug: null, parentId: "menu-spmb", order: 0, visible: true, target: "_self" },
  { id: "menu-perpustakaan", label: "Perpustakaan", href: "/perpustakaan", pageSlug: null, parentId: "menu-spmb", order: 1, visible: true, target: "_self" },
  { id: "menu-pengaduan", label: "Pengaduan", href: "/pengaduan", pageSlug: null, parentId: "menu-spmb", order: 2, visible: true, target: "_self" },
];

const legacySeedMenu = [
  ["menu-profil", "Profil", "#", null, 0], ["menu-tentang", "Tentang", "#", "menu-profil", 0],
  ["menu-visi", "Visi-Misi", "/visi-misi", "menu-tentang", 0], ["menu-sejarah", "Sejarah", "/sejarah", "menu-tentang", 1],
  ["menu-guru", "Guru", "/guru", "menu-profil", 1], ["menu-berita", "Berita", "/berita", null, 1],
  ["menu-program", "Program", "/program", null, 2], ["menu-spmb", "SPMB", "/spmb", null, 3],
] as const;

function isLegacySeedMenu(items: MenuNode[]) {
  return legacySeedMenu.every(([id, label, href, parentId, order]) => {
    const item = items.find((candidate) => candidate.id === id);
    return item?.label === label && item.href === href && item.parentId === parentId && item.order === order && item.visible;
  });
}

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

export function buildPublicMenu(items: MenuNode[], pages: { slug: string; title: string }[]) {
  const defaults = new Set(DEFAULT_PUBLIC_MENU.map((item) => item.id));
  const menuItems = isLegacySeedMenu(items)
    ? [...DEFAULT_PUBLIC_MENU, ...items.filter((item) => !defaults.has(item.id))]
    : items;
  const tree = buildMenuTree(menuItems);
  const existingHrefs = new Set(menuItems.filter((item) => item.visible).map((item) => item.href));
  const pageLinks = pages.filter((page) => !existingHrefs.has(`/${page.slug}`));

  if (pageLinks.length) {
    tree.push({
      id: "cms-pages",
      label: "Halaman",
      href: "#",
      pageSlug: null,
      parentId: null,
      order: tree.length,
      visible: true,
      target: "_self",
      children: pageLinks.map((page, order) => ({ id: `page-${page.slug}`, label: page.title, href: `/${page.slug}`, pageSlug: page.slug, parentId: "cms-pages", order, visible: true, target: "_self" })),
    });
  }

  return tree;
}

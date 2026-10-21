"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ThemeToggle } from "@/components/ThemeToggle";
import { SignOutButton } from "./signout-button";

const groups = [
  {
    label: "Menu utama",
    links: [
      ["Ringkasan", "/admin", "grid"],
      ["Posting", "/admin/posts", "file"],
      ["Halaman", "/admin/pages", "page"],
      ["Galeri", "/admin/galeri", "image"],
      ["Agenda", "/admin/agenda", "calendar"],
      ["Download", "/admin/download", "download"],
      ["Inbox", "/admin/inbox", "inbox"],
      ["Komentar", "/admin/komentar", "chat"],
    ],
  },
  {
    label: "Data sekolah",
    links: [
      ["GTK", "/admin/gtk", "user"],
      ["Siswa", "/admin/siswa", "users"],
      ["Kelas", "/admin/kelas", "book"],
      ["Jurusan", "/admin/jurusan", "grid"],
      ["Ekstrakurikuler", "/admin/ekskul", "star"],
      ["Prestasi", "/admin/prestasi", "award"],
    ],
  },
  {
    label: "Pengelolaan",
    links: [
      ["SPMB", "/admin/spmb", "clipboard"],
      ["Menu website", "/admin/menu", "menu"],
      ["Identitas & SEO", "/admin/identitas", "settings"],
      ["Sambutan", "/admin/sambutan", "chat"],
      ["Tema", "/admin/tema", "palette"],
      ["Pengguna", "/admin/users", "users"],
      ["System Log", "/admin/logs", "activity"],
    ],
  },
];

function NavIcon({ name }: { name: string }) {
  const common = { fill: "none", stroke: "currentColor", strokeWidth: 1.7, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  const shapes: Record<string, React.ReactNode> = {
    grid: <><rect x="3.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="3.5" width="7" height="7" rx="1.5" /><rect x="3.5" y="13.5" width="7" height="7" rx="1.5" /><rect x="13.5" y="13.5" width="7" height="7" rx="1.5" /></>,
    file: <><path d="M7 3.5h7l4 4v13H7z" /><path d="M14 3.5v4h4M10 12h5M10 16h5" /></>,
    page: <><path d="M6 3.5h9l4 4v13H6z" /><path d="M15 3.5v4h4M9 12h7M9 16h7" /></>,
    image: <><rect x="3.5" y="4.5" width="17" height="15" rx="2" /><circle cx="9" cy="10" r="1.5" /><path d="m5 17 5-4 3 2 3-3 4 4" /></>,
    calendar: <><rect x="4" y="5" width="16" height="15" rx="2" /><path d="M8 3.5v3M16 3.5v3M4 9h16M8 13h2M13 13h3M8 16.5h2" /></>,
    download: <><path d="M12 3.5v11m0 0 4-4m-4 4-4-4" /><path d="M5 16v4h14v-4" /></>,
    inbox: <><path d="M4 5h16l1 11h-5l-2 3h-4l-2-3H3z" /><path d="M4 13h4l2 3h4l2-3h4" /></>,
    chat: <><path d="M4 5.5h16v12H9l-5 3z" /><path d="M8 10h8M8 14h5" /></>,
    user: <><circle cx="12" cy="8" r="3.2" /><path d="M5.5 20c.4-3.5 2.5-5.5 6.5-5.5s6.1 2 6.5 5.5" /></>,
    users: <><circle cx="9" cy="8" r="2.8" /><path d="M3.5 19c.3-3.1 2.1-4.8 5.5-4.8 2 0 3.5.6 4.4 1.9" /><path d="M15.5 5.5a2.7 2.7 0 0 1 0 5.2M16 14.3c2.7.4 4.1 1.9 4.4 4.7" /></>,
    book: <><path d="M4 5.5a3 3 0 0 1 3-2h5v17H7a3 3 0 0 0-3 2zM20 5.5a3 3 0 0 0-3-2h-5v17h5a3 3 0 0 1 3 2z" /></>,
    star: <><path d="m12 3 2.6 5.3 5.9.9-4.3 4.1 1 5.8-5.2-2.8-5.2 2.8 1-5.8-4.3-4.1 5.9-.9z" /></>,
    award: <><circle cx="12" cy="9" r="5.5" /><path d="m8.5 13.5-1 7 4.5-2.5 4.5 2.5-1-7" /></>,
    clipboard: <><rect x="5" y="5" width="14" height="16" rx="2" /><path d="M9 5V3h6v2M9 11h6M9 15h6" /></>,
    menu: <><path d="M4 6h16M4 12h16M4 18h16" /></>,
    settings: <><circle cx="12" cy="12" r="3" /><path d="m19.4 15 .1.1 1.1 1.9-1.7 2.9-2.2-.5a8 8 0 0 1-1.7 1l-.8 2.1h-3.4L10 20.4a8 8 0 0 1-1.7-1l-2.2.5-1.7-2.9 1.1-1.9a8 8 0 0 1 0-2l-1.1-1.9 1.7-2.9 2.2.5a8 8 0 0 1 1.7-1l.8-2.1h3.4l.8 2.1a8 8 0 0 1 1.7 1l2.2-.5 1.7 2.9-1.1 1.9a8 8 0 0 1-.1 2Z" transform="translate(-1 -1) scale(.95)" /></>,
    palette: <><path d="M12 3.5a8.5 8.5 0 1 0 0 17h1.3a2 2 0 0 0 1.5-3.3 1.8 1.8 0 0 1 1.4-3h1.3a3 3 0 0 0 3-3c0-4.3-3.8-7.7-8.5-7.7Z" /><circle cx="7.5" cy="11" r=".8" /><circle cx="10" cy="7.5" r=".8" /><circle cx="15" cy="8" r=".8" /></>,
    activity: <><path d="M3 12h4l3-7 4 14 3-7h4" /></>,
  };

  return <svg aria-hidden="true" viewBox="0 0 24 24" className="h-[18px] w-[18px] shrink-0" {...common}>{shapes[name] ?? shapes.grid}</svg>;
}

export function AdminShell({ children, user }: { children: React.ReactNode; user?: { name: string; role: string } }) {
  const pathname = usePathname();

  if (pathname === "/admin/login") return <>{children}</>;

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 dark:bg-slate-950 dark:text-slate-100 lg:pl-[230px]">
      <aside className="border-b border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900 lg:fixed lg:inset-y-0 lg:left-0 lg:z-40 lg:flex lg:w-[230px] lg:flex-col lg:border-b-0 lg:border-r">
        <Link href="/admin" className="flex items-center gap-[10px] px-[16px] py-[16px]">
          <span className="flex h-[36px] w-[36px] items-center justify-center rounded-[11px] bg-[rgb(var(--brand-50))] text-[rgb(var(--brand-700))]">
            <NavIcon name="grid" />
          </span>
          <span className="leading-tight">
            <span className="block text-[16px] font-extrabold tracking-tight text-slate-900 dark:text-white">IMBS <span className="text-[rgb(var(--brand-600))]">CMS</span></span>
            <span className="mt-[3px] block text-[9px] font-semibold uppercase tracking-[.13em] text-slate-400">Sistem Informasi Sekolah</span>
          </span>
        </Link>

        <nav aria-label="Navigasi admin" className="flex gap-[18px] overflow-x-auto px-[12px] pb-[12px] lg:block lg:flex-1 lg:space-y-[18px] lg:overflow-x-hidden lg:overflow-y-auto lg:px-[12px] lg:py-[8px]">
          {groups.map((group) => (
            <div key={group.label} className="shrink-0 lg:shrink">
              <p className="hidden px-[10px] pb-[8px] text-[10px] font-bold uppercase tracking-[.12em] text-slate-400 lg:block">{group.label}</p>
              <div className="flex gap-[4px] lg:block lg:space-y-[3px]">
                {group.links.map(([label, href, icon]) => {
                  const active = href === "/admin" ? pathname === href : pathname.startsWith(href);
                  return (
                    <Link
                      key={href}
                      href={href}
                      aria-current={active ? "page" : undefined}
                      className={`flex items-center gap-[10px] whitespace-nowrap rounded-[9px] px-[10px] py-[9px] text-[13px] transition-colors ${active ? "bg-[rgb(var(--brand-50))] font-semibold text-[rgb(var(--brand-700))]" : "text-slate-600 hover:bg-slate-50 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-800 dark:hover:text-white"}`}
                    >
                      <NavIcon name={icon} />
                      <span>{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div className="hidden border-t border-slate-200 p-[12px] dark:border-slate-800 lg:block">
          <div className="mb-[10px] flex min-w-0 items-center gap-[9px]">
            <span className="flex h-[34px] w-[34px] shrink-0 items-center justify-center rounded-full bg-orange-100 text-[11px] font-bold text-orange-700">{user?.name.slice(0, 1).toUpperCase() || "A"}</span>
            <span className="min-w-0">
              <span className="block truncate text-[12px] font-semibold text-slate-800 dark:text-slate-100">{user?.name || "Admin IMBS"}</span>
              <span className="block truncate text-[10px] text-slate-500 dark:text-slate-400">{user?.role || "Admin"}</span>
            </span>
          </div>
          <SignOutButton />
        </div>
      </aside>

      <div className="min-h-screen min-w-0">
        <header className="border-b border-slate-200 bg-white px-[21px] py-[8px] dark:border-slate-800 dark:bg-slate-900">
          <div className="mx-auto flex max-w-6xl justify-end gap-[8px]">
            <ThemeToggle />
            <span className="lg:hidden"><SignOutButton /></span>
          </div>
        </header>
        {children}
      </div>
    </div>
  );
}

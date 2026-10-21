import { getServerSession } from "next-auth";
import Link from "next/link";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { Button } from "@/components/ui/button";

const dateShort = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "short" });
const dateLong = new Intl.DateTimeFormat("id-ID", { day: "numeric", month: "long", year: "numeric" });
const timeShort = new Intl.DateTimeFormat("id-ID", { hour: "2-digit", minute: "2-digit" });

export default async function AdminHome() {
  const session = await getServerSession(authOptions);
  const now = new Date();
  const [activeStudents, publishedPosts, upcomingAgendaCount, pendingApplicants, agendas, posts, logs] = await Promise.all([
    db.student.count({ where: { status: "AKTIF" } }),
    db.post.count({ where: { status: "PUBLISHED", publishedAt: { lte: now } } }),
    db.agenda.count({ where: { startAt: { gte: now } } }),
    db.sPMBApplicant.count({ where: { status: "PENDING" } }),
    db.agenda.findMany({ where: { startAt: { gte: now } }, orderBy: { startAt: "asc" }, take: 4, select: { id: true, title: true, location: true, startAt: true } }),
    db.post.findMany({ orderBy: { updatedAt: "desc" }, take: 5, select: { id: true, title: true, type: true, status: true, updatedAt: true } }),
    db.systemLog.findMany({ orderBy: { createdAt: "desc" }, take: 5, include: { user: { select: { name: true } } } }),
  ]);

  const stats = [
    { label: "Siswa aktif", value: activeStudents, note: "Akun siswa di database", href: "/admin/siswa", icon: "S", tone: "bg-blue-50 text-blue-600 dark:bg-blue-950 dark:text-blue-300" },
    { label: "Posting terbit", value: publishedPosts, note: "Berita dan informasi sekolah", href: "/admin/posts", icon: "P", tone: "bg-emerald-50 text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300" },
    { label: "Agenda mendatang", value: upcomingAgendaCount, note: "Jadwal yang akan berjalan", href: "/admin/agenda", icon: "A", tone: "bg-violet-50 text-violet-600 dark:bg-violet-950 dark:text-violet-300" },
    { label: "SPMB perlu ditinjau", value: pendingApplicants, note: "Pendaftar menunggu verifikasi", href: "/admin/spmb", icon: "S", tone: "bg-orange-50 text-orange-600 dark:bg-orange-950 dark:text-orange-300" },
  ];
  const quickLinks = [
    { title: "Tulis posting", detail: "Berita, agenda, atau pengumuman", href: "/admin/posts/baru", mark: "+", tone: "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" },
    { title: "Kelola siswa", detail: "Lihat data dan kelas siswa", href: "/admin/siswa", mark: "S", tone: "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-300" },
    { title: "Verifikasi SPMB", detail: `${pendingApplicants.toLocaleString("id-ID")} pendaftar menunggu`, href: "/admin/spmb", mark: "✓", tone: "bg-violet-50 text-violet-700 dark:bg-violet-950 dark:text-violet-300" },
    { title: "Atur website", detail: "Menu, tema, dan identitas sekolah", href: "/admin/identitas", mark: "⚙", tone: "bg-orange-50 text-orange-700 dark:bg-orange-950 dark:text-orange-300" },
  ];

  return (
    <main className="mx-auto max-w-6xl space-y-[21px] px-[16px] py-[24px] sm:px-[21px] sm:py-[30px]">
      <header className="flex flex-wrap items-center justify-between gap-[16px]">
        <div>
          <p className="mb-[8px] flex items-center gap-[7px] text-[11px] font-bold uppercase tracking-[.13em] text-[rgb(var(--brand-700))]">
            <span aria-hidden="true">✳</span> Ruang kerja sekolah
          </p>
          <h1 className="text-[26px] font-bold leading-tight text-slate-900 dark:text-white sm:text-[30px]">
            Assalamu’alaikum, {session?.user?.name || "Admin"} <span aria-hidden="true">👋</span>
          </h1>
          <p className="mt-[5px] text-[14px] text-slate-500 dark:text-slate-400">Ringkasan aktivitas CMS IMBS hari ini.</p>
        </div>
        <Button asChild variant="default"><Link href="/admin/posts/baru" className="!rounded-[10px] !px-[16px] !py-[10px] !text-[14px]">
          <span aria-hidden="true" className="mr-[7px] text-[17px] font-normal">＋</span> Tulis posting
        </Link></Button>
      </header>

      <section aria-label="Ringkasan CMS" className="grid gap-[13px] sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((item) => (
          <Link key={item.label} href={item.href} className="group rounded-[13px] border border-slate-200 bg-white p-[16px] shadow-[0_3px_12px_-10px_rgba(15,23,42,.3)] transition hover:border-[rgb(var(--brand-500))] dark:border-slate-800 dark:bg-slate-900">
            <span className="flex items-center gap-[10px]">
              <span className={`flex h-[40px] w-[40px] items-center justify-center rounded-[11px] text-[15px] font-bold ${item.tone}`}>{item.icon}</span>
              <span className="text-[13px] text-slate-600 dark:text-slate-300">{item.label}</span>
            </span>
            <span className="mt-[10px] block text-[26px] font-bold leading-none text-slate-900 dark:text-white">{item.value.toLocaleString("id-ID")}</span>
            <span className="mt-[7px] block text-[11px] text-slate-400">{item.note}</span>
          </Link>
        ))}
      </section>

      <div className="grid gap-[18px] xl:grid-cols-[1.45fr_1fr]">
        <section aria-labelledby="agenda-title" className="rounded-[13px] border border-slate-200 bg-white p-[18px] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-[12px] flex items-start justify-between gap-[12px]">
            <div>
              <h2 id="agenda-title" className="text-[16px] font-bold text-slate-900 dark:text-white">Agenda sekolah</h2>
              <p className="mt-[3px] text-[12px] text-slate-500 dark:text-slate-400">Jadwal yang akan datang</p>
            </div>
            <Link href="/admin/agenda" className="text-[12px] font-semibold text-[rgb(var(--brand-700))] hover:underline">Lihat semua ↗</Link>
          </div>
          {agendas.length ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {agendas.map((agenda) => (
                <li key={agenda.id} className="flex items-center gap-[12px] py-[12px] first:pt-[4px] last:pb-[2px]">
                  <span className="flex h-[42px] w-[48px] shrink-0 flex-col items-center justify-center rounded-[9px] bg-[rgb(var(--brand-50))] text-[11px] font-bold leading-tight text-[rgb(var(--brand-700))]">
                    <span>{dateShort.format(agenda.startAt).split(" ")[0]}</span>
                    <span>{dateShort.format(agenda.startAt).split(" ")[1]}</span>
                  </span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">{agenda.title}</span>
                    <span className="mt-[3px] block truncate text-[11px] text-slate-500 dark:text-slate-400">{timeShort.format(agenda.startAt)}{agenda.location ? ` · ${agenda.location}` : ""}</span>
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className="flex min-h-[166px] flex-col items-center justify-center text-center">
              <span aria-hidden="true" className="flex h-[42px] w-[42px] items-center justify-center rounded-[11px] bg-emerald-50 text-[18px] text-emerald-600 dark:bg-emerald-950 dark:text-emerald-300">▦</span>
              <p className="mt-[10px] text-[13px] font-semibold text-slate-800 dark:text-slate-100">Belum ada agenda mendatang</p>
              <Link href="/admin/agenda" className="mt-[4px] text-[11px] text-[rgb(var(--brand-700))] hover:underline">Buat agenda sekolah</Link>
            </div>
          )}
        </section>

        <section aria-labelledby="quick-title" className="rounded-[13px] border border-slate-200 bg-white p-[18px] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-[7px]">
            <h2 id="quick-title" className="text-[16px] font-bold text-slate-900 dark:text-white">Akses cepat</h2>
            <p className="mt-[3px] text-[12px] text-slate-500 dark:text-slate-400">Pekerjaan yang sering dibuka</p>
          </div>
          <ul>
            {quickLinks.map((item) => (
              <li key={item.title} className="border-b border-slate-100 last:border-0 dark:border-slate-800">
                <Link href={item.href} className="group flex items-center gap-[10px] py-[10px]">
                  <span aria-hidden="true" className={`flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] text-[14px] font-semibold ${item.tone}`}>{item.mark}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block text-[13px] font-semibold text-slate-800 dark:text-slate-100">{item.title}</span>
                    <span className="mt-[2px] block truncate text-[11px] text-slate-500 dark:text-slate-400">{item.detail}</span>
                  </span>
                  <span aria-hidden="true" className="text-[18px] text-slate-400 transition group-hover:translate-x-[2px]">›</span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="grid gap-[18px] xl:grid-cols-[1.45fr_1fr]">
        <section aria-labelledby="posts-title" className="rounded-[13px] border border-slate-200 bg-white p-[18px] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-[10px] flex items-start justify-between gap-[12px]">
            <div>
              <h2 id="posts-title" className="text-[16px] font-bold text-slate-900 dark:text-white">Posting terbaru</h2>
              <p className="mt-[3px] text-[12px] text-slate-500 dark:text-slate-400">Konten yang terakhir diperbarui</p>
            </div>
            <Link href="/admin/posts" className="text-[12px] font-semibold text-[rgb(var(--brand-700))] hover:underline">Kelola ↗</Link>
          </div>
          {posts.length ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {posts.map((post) => (
                <li key={post.id}>
                  <Link href={`/admin/posts/${post.id}`} className="flex items-center gap-[10px] py-[11px]">
                    <span className="min-w-0 flex-1">
                      <span className="block truncate text-[13px] font-semibold text-slate-800 dark:text-slate-100">{post.title}</span>
                      <span className="mt-[3px] block text-[11px] text-slate-500 dark:text-slate-400">{post.type} · {dateLong.format(post.updatedAt)}</span>
                    </span>
                    <span className={`shrink-0 rounded-full px-[9px] py-[4px] text-[10px] font-semibold ${post.status === "PUBLISHED" ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300" : "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300"}`}>
                      {post.status === "PUBLISHED" ? "Terbit" : post.status === "DRAFT" ? "Draft" : post.status}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className="flex min-h-[130px] flex-col items-center justify-center text-center">
              <p className="text-[13px] font-semibold text-slate-800 dark:text-slate-100">Belum ada posting</p>
              <Link href="/admin/posts/baru" className="mt-[4px] text-[11px] text-[rgb(var(--brand-700))] hover:underline">Tulis posting pertama</Link>
            </div>
          )}
        </section>

        <section aria-labelledby="activity-title" className="rounded-[13px] border border-slate-200 bg-white p-[18px] dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-[10px] flex items-start justify-between gap-[12px]">
            <div>
              <h2 id="activity-title" className="text-[16px] font-bold text-slate-900 dark:text-white">Aktivitas admin</h2>
              <p className="mt-[3px] text-[12px] text-slate-500 dark:text-slate-400">Catatan aktivitas terbaru</p>
            </div>
            <Link href="/admin/logs" className="text-[12px] font-semibold text-[rgb(var(--brand-700))] hover:underline">Semua ↗</Link>
          </div>
          {logs.length ? (
            <ul className="divide-y divide-slate-100 dark:divide-slate-800">
              {logs.map((log) => (
                <li key={log.id} className="flex items-start gap-[10px] py-[11px]">
                  <span aria-hidden="true" className="mt-[4px] h-[8px] w-[8px] shrink-0 rounded-full bg-[rgb(var(--brand-500))]" />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-[12px] font-semibold text-slate-800 dark:text-slate-100">{log.action.replaceAll("_", " ")}</span>
                    <span className="mt-[3px] block truncate text-[11px] text-slate-500 dark:text-slate-400">{log.user?.name || "Sistem"}{log.detail ? ` · ${log.detail}` : ""}</span>
                  </span>
                  <time className="shrink-0 text-[10px] text-slate-400" dateTime={log.createdAt.toISOString()}>{timeShort.format(log.createdAt)}</time>
                </li>
              ))}
            </ul>
          ) : (
            <div role="status" className="flex min-h-[130px] items-center justify-center text-center text-[12px] text-slate-500 dark:text-slate-400">Belum ada aktivitas tercatat.</div>
          )}
        </section>
      </div>
    </main>
  );
}

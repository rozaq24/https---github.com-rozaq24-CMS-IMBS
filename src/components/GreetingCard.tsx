import Link from "next/link";

export type Greeting = { title: string; body: string; principalName: string; photo: string | null; active: boolean };

// Kartu sambutan kepsek — dipakai homepage, /profil, /sambutan
export function GreetingCard({ greeting, compact = false }: { greeting: Greeting | null; compact?: boolean }) {
  if (!greeting || !greeting.active) return null;
  const paragraphs = greeting.body.split(/\n{2,}|\r\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <section className={`card spotlight-card flex gap-[21px] flex-col items-start text-slate-900 dark:text-slate-100 ${compact ? "md:flex-col" : "md:flex-row"}`}>
      {greeting.photo ? (
        <img src={greeting.photo} alt={greeting.principalName} className={`rounded-[21px] w-full object-cover ${compact ? "h-[300px]" : "h-[260px] md:w-[220px]"}`} />
      ) : (
        <div className={`rounded-[21px] w-full flex items-center justify-center text-[64px] font-extrabold text-white ${compact ? "h-[300px]" : "h-[260px] md:w-[220px]"}`} style={{ background: "linear-gradient(135deg, rgb(var(--brand-600)), rgb(var(--accent-500)))" }}>
          {greeting.principalName.charAt(0)}
        </div>
      )}
      <div className="flex-1">
        <p className="text-[13px] uppercase tracking-widest text-slate-500">{greeting.title}</p>
        <h2 className="h-gold-2 mt-[8px]">{greeting.principalName}</h2>
        {(compact ? paragraphs.slice(0, 1) : paragraphs).map((p, i) => (
          <p key={i} className="mt-[13px] text-[16px] text-slate-600">{p}</p>
        ))}
        {compact && <Link href="/sambutan" className="btn-outline !py-[8px] mt-[13px] inline-block">Baca Selengkapnya</Link>}
      </div>
    </section>
  );
}

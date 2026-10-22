import Link from "next/link";
import type { SiteIdentity } from "@/lib/settings";

const explore = [["Profil", "/profil"], ["Sambutan", "/sambutan"], ["Guru & Tendik", "/guru"], ["Program", "/program"], ["Ekstrakurikuler", "/ekstrakurikuler"], ["Prestasi", "/prestasi"], ["Berita", "/berita"], ["Agenda", "/agenda"], ["Galeri", "/galeri"], ["Unduhan", "/download"], ["FAQ", "/faq"]];
const services = [["SPMB Online", "/spmb"], ["E-Learning", "/e-learning"], ["Perpustakaan", "/perpustakaan"], ["Pengaduan", "/pengaduan"]];

export function SiteFooter({ identity }: { identity: SiteIdentity }) {
  const socials = [["Facebook", identity.facebook], ["Instagram", identity.instagram], ["YouTube", identity.youtube]].filter((item) => item[1]);
  const linkList = (links: string[][]) => links.map(([label, href]) => <Link key={href} href={href} className="block min-h-11 w-fit py-2 text-[color-mix(in_srgb,var(--echo-paper-stock)_70%,transparent)] underline-offset-4 transition-colors hover:text-[var(--echo-paper-stock)] hover:underline">{label}</Link>);

  return <footer className="mt-0 border-t border-[color-mix(in_srgb,var(--echo-paper-stock)_10%,transparent)] bg-[var(--echo-text)] text-[var(--echo-paper-stock)]">
    <div className="mx-auto grid max-w-7xl gap-8 px-5 py-14 sm:grid-cols-2 sm:px-8 lg:grid-cols-4 lg:px-12">
      <section>
        {identity.logo && <img src={identity.logo} alt="" className="mb-3 h-12 w-12 object-contain" />}
        <h2 className="font-display text-xl font-semibold">{identity.siteTitle}</h2>
        <p className="mt-3 text-sm leading-6 text-[color-mix(in_srgb,var(--echo-paper-stock)_65%,transparent)]">{identity.description}</p>
        {socials.length > 0 && <nav aria-label="Media sosial" className="mt-4 flex flex-wrap gap-4">{socials.map(([name, url]) => <a key={name} href={url!} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center text-sm underline underline-offset-4">{name}</a>)}</nav>}
      </section>
      <nav aria-label="Jelajahi halaman" className="space-y-1 text-sm"><h2 className="mb-2 font-display text-lg font-semibold">Jelajahi</h2>{linkList(explore)}</nav>
      <nav aria-label="Layanan sekolah" className="space-y-1 text-sm"><h2 className="mb-2 font-display text-lg font-semibold">Layanan</h2>{linkList(services)}</nav>
      <section className="space-y-2 text-sm text-[color-mix(in_srgb,var(--echo-paper-stock)_70%,transparent)]">
        <h2 className="mb-2 font-display text-lg font-semibold text-[var(--echo-paper-stock)]">Kontak</h2>
        {identity.address && <p className="leading-6">{identity.address}</p>}
        {identity.phone && <p><a href={`tel:${identity.phone}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{identity.phone}</a></p>}
        {identity.email && <p><a href={`mailto:${identity.email}`} className="inline-flex min-h-11 items-center underline underline-offset-4">{identity.email}</a></p>}
        {identity.mapUrl && <a href={identity.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center underline underline-offset-4">Lihat lokasi sekolah</a>}
        {!identity.address && !identity.phone && !identity.email && <p>Kirim pesan melalui formulir pengaduan sekolah.</p>}
        <p className="pt-3 text-xs text-[color-mix(in_srgb,var(--echo-paper-stock)_65%,transparent)]">&copy; {new Date().getFullYear()} {identity.siteTitle}</p>
      </section>
    </div>
  </footer>;
}

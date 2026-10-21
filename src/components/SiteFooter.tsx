import Link from "next/link";
import type { SiteIdentity } from "@/lib/settings";

const explore = [["Profil", "/profil"], ["Guru", "/guru"], ["Program", "/program"], ["Prestasi", "/prestasi"], ["Berita", "/berita"], ["Agenda", "/agenda"], ["Galeri", "/galeri"], ["Unduhan", "/download"], ["FAQ", "/faq"]];
const services = [["SPMB Online", "/spmb"], ["E-Learning", "/e-learning"], ["Perpustakaan", "/perpustakaan"], ["Pengaduan", "/pengaduan"]];

export function SiteFooter({ identity }: { identity: SiteIdentity }) {
  const socials = [["Facebook", identity.facebook], ["Instagram", identity.instagram], ["YouTube", identity.youtube]].filter((item) => item[1]);
  const linkList = (links: string[][]) => links.map(([label, href]) => <Link key={href} href={href} className="block w-fit text-slate-600 underline-offset-4 hover:text-slate-900 hover:underline dark:text-slate-300 dark:hover:text-white">{label}</Link>);

  return <footer className="mt-[34px] border-t border-slate-200 bg-white dark:border-slate-800 dark:bg-slate-900">
    <div className="mx-auto grid max-w-6xl gap-[34px] px-[21px] py-[34px] sm:grid-cols-2 lg:grid-cols-4">
      <section>
        {identity.logo && <img src={identity.logo} alt="" className="mb-[13px] h-12 w-12 object-contain" />}
        <h2 className="text-[18px] font-bold">{identity.siteTitle}</h2>
        <p className="mt-[8px] text-[14px] text-slate-600 dark:text-slate-300">{identity.description}</p>
        {socials.length > 0 && <nav aria-label="Media sosial" className="mt-[13px] flex flex-wrap gap-[13px]">{socials.map(([name, url]) => <a key={name} href={url!} target="_blank" rel="noopener noreferrer" className="text-[14px] underline">{name}</a>)}</nav>}
      </section>
      <nav aria-label="Jelajahi halaman" className="space-y-[8px] text-[14px]"><h2 className="mb-[13px] text-[16px] font-semibold">Jelajahi</h2>{linkList(explore)}</nav>
      <nav aria-label="Layanan sekolah" className="space-y-[8px] text-[14px]"><h2 className="mb-[13px] text-[16px] font-semibold">Layanan</h2>{linkList(services)}</nav>
      <section className="space-y-[8px] text-[14px]">
        <h2 className="mb-[13px] text-[16px] font-semibold">Kontak</h2>
        {identity.address && <p>{identity.address}</p>}
        {identity.phone && <p><a href={`tel:${identity.phone}`} className="underline">{identity.phone}</a></p>}
        {identity.email && <p><a href={`mailto:${identity.email}`} className="underline">{identity.email}</a></p>}
        {identity.mapUrl && <a href={identity.mapUrl} target="_blank" rel="noopener noreferrer" className="inline-block underline">Lihat lokasi sekolah</a>}
        {!identity.address && !identity.phone && !identity.email && <p className="text-slate-600 dark:text-slate-300">Kirim pesan melalui formulir pengaduan sekolah.</p>}
        <p className="pt-[13px] text-[13px] text-slate-500">© {new Date().getFullYear()} {identity.siteTitle}</p>
      </section>
    </div>
  </footer>;
}

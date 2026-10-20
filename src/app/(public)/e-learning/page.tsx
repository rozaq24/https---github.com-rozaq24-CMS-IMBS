import { getSiteSettings } from "@/lib/settings";
export const metadata = { title: "E-Learning", description: "Informasi akses pembelajaran daring sekolah." };
export default async function ELearningPage() {
  const { identity } = await getSiteSettings();
  return <main className="mx-auto max-w-4xl space-y-[21px] px-[21px] py-[34px]"><header><h1 className="h-gold-1">E-<span className="grad-text">Learning</span></h1><p className="mt-[8px] text-slate-600">Informasi akses ruang belajar digital sekolah.</p></header><section className="card space-y-[13px]"><h2 className="h-gold-2">Akses pembelajaran</h2><p>Gunakan tautan ruang belajar yang diberikan oleh guru atau operator sekolah. Akses memerlukan akun yang disediakan sekolah.</p>{identity.email ? <a className="btn-primary inline-flex" href={`mailto:${identity.email}?subject=${encodeURIComponent("Akses E-Learning")}`}>Minta informasi akses</a> : <p className="text-slate-600">Hubungi sekolah untuk memperoleh tautan dan akun belajar.</p>}</section></main>;
}

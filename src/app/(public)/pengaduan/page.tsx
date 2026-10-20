import { ContactForm } from "@/components/ContactForm";

export const metadata = { title: "Hubungi Kami", description: "Kirim pesan atau pengaduan kepada sekolah" };
export default function ContactPage() {
  return <main className="mx-auto max-w-3xl px-[21px] py-[34px] space-y-[21px]"><header><h1 className="h-gold-1">Hubungi <span className="grad-text">Kami</span></h1><p className="mt-[8px] text-slate-600">Pesan akan diteruskan ke pihak sekolah.</p></header><ContactForm /></main>;
}

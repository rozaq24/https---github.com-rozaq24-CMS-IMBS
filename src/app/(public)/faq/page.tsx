import { FaqAccordion } from "@/components/FaqAccordion";
export const metadata = { title: "FAQ", description: "Jawaban untuk pertanyaan umum tentang layanan sekolah." };
export default function FaqPage() { return <main className="mx-auto max-w-3xl space-y-[21px] px-[21px] py-[34px]"><header><h1 className="h-gold-1">Pertanyaan <span className="grad-text">Umum</span></h1><p className="mt-[8px] text-slate-600">Cari jawaban tentang layanan dan informasi sekolah.</p></header><FaqAccordion /></main>; }

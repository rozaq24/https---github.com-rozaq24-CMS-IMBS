"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";

const LABELS: Record<string, string> = { berita: "Berita", agenda: "Agenda", profil: "Profil", sambutan: "Sambutan", guru: "Guru", program: "Program", ekstrakurikuler: "Ekstrakurikuler", prestasi: "Prestasi", galeri: "Galeri", download: "Unduhan", spmb: "SPMB", faq: "FAQ", pengaduan: "Pengaduan", "e-learning": "E-Learning", perpustakaan: "Perpustakaan", status: "Cek Status" };
export function Breadcrumbs() {
  const pathname = usePathname(); const parts = pathname.split("/").filter(Boolean);
  if (!parts.length) return null;
  return <nav aria-label="Breadcrumb" className="mx-auto max-w-6xl px-[21px] pt-[13px] text-[13px] text-slate-500"><ol className="flex flex-wrap gap-[8px]">{[{ label: "Beranda", href: "/" }, ...parts.map((part, index) => ({ label: LABELS[part] || (index > 0 ? "Detail" : decodeURIComponent(part)), href: `/${parts.slice(0, index + 1).join("/")}` }))].map((item, index, list) => <li key={item.href} className="flex gap-[8px]">{index > 0 && <span aria-hidden="true">/</span>}{index === list.length - 1 ? <span aria-current="page" className="text-slate-700 dark:text-slate-200">{item.label}</span> : <Link href={item.href} className="underline">{item.label}</Link>}</li>)}</ol></nav>;
}

import Link from "next/link";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
export default function PublicNotFound() { return <main className="mx-auto max-w-3xl px-[21px] py-[55px]"><Card className="space-y-[13px]" as="section"><h1 className="h-gold-1">Halaman tidak ditemukan</h1><p>Alamat mungkin berubah atau halaman belum tersedia.</p><Button asChild variant="default"><Link href="/" className="inline-flex">Kembali ke Beranda</Link></Button></Card></main>; }

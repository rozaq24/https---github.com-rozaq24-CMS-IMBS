"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
export default function PublicError({ reset }: { error: Error & { digest?: string }; reset: () => void }) { return <main className="mx-auto max-w-3xl px-[21px] py-[55px]"><Card className="space-y-[13px]" role="alert" as="section"><h1 className="h-gold-2">Halaman gagal dimuat</h1><p>Silakan coba muat ulang halaman ini.</p><Button className="" onClick={reset} variant="default">Coba lagi</Button></Card></main>; }

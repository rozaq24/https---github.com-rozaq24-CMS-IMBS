import { db } from "@/lib/db";
import { GreetingCard } from "@/components/GreetingCard";

export const revalidate = 60;

export const metadata = { title: "Sambutan Kepala Sekolah", description: "Kata sambutan Kepala Sekolah" };

export default async function SambutanPage() {
  const greeting = await db.greeting.findUnique({ where: { id: 1 } });
  return (
    <main className="mx-auto max-w-3xl px-[21px] py-[34px] space-y-[21px]">
      <h1 className="h-gold-1">Sambutan <span className="grad-text">Kepala Sekolah</span></h1>
      <GreetingCard greeting={greeting} />
    </main>
  );
}

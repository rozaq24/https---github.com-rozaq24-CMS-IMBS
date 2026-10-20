import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";

export const revalidate = 60;

export async function generateMetadata({ params }: { params: { id: string } }) {
  const teacher = await db.teacher.findFirst({ where: { id: params.id, active: true } });
  return teacher ? { title: teacher.name, description: `${teacher.position} di sekolah` } : { title: "Guru tidak ditemukan" };
}

export default async function TeacherProfile({ params }: { params: { id: string } }) {
  const teacher = await db.teacher.findFirst({ where: { id: params.id, active: true } });
  if (!teacher) notFound();
  return <main className="mx-auto max-w-3xl px-[21px] py-[34px] space-y-[21px]"><Link href="/guru" className="text-[14px] underline">← Kembali ke Direktori</Link><article className="card flex flex-col sm:flex-row gap-[21px] items-start">{teacher.photo && <img src={teacher.photo} alt={teacher.name} className="h-[180px] w-[180px] rounded-full object-cover" />}<div><h1 className="h-gold-1">{teacher.name}</h1><p className="mt-[8px] text-[18px] grad-text">{teacher.position}</p><dl className="mt-[21px] space-y-[8px]">{teacher.rank && <div><dt className="font-semibold">Pangkat/Golongan</dt><dd>{teacher.rank}</dd></div>}{teacher.education && <div><dt className="font-semibold">Pendidikan</dt><dd>{teacher.education}</dd></div>}{teacher.experience && <div><dt className="font-semibold">Pengalaman</dt><dd>{teacher.experience}</dd></div>}{teacher.subjects && <div><dt className="font-semibold">Mata Pelajaran</dt><dd>{teacher.subjects}</dd></div>}</dl></div></article></main>;
}

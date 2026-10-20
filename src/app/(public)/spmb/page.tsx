import { SpmbForm } from "@/components/SpmbForm";
export const metadata = { title: "SPMB Online", description: "Informasi dan pendaftaran murid baru IMBS." };
export default function SpmbPage() { return <main className="mx-auto max-w-3xl space-y-[21px] px-[21px] py-[34px]"><header><h1 className="h-gold-1">SPMB <span className="grad-text">Online</span></h1><p className="mt-[8px] text-slate-600">Pendaftaran murid baru dan unggah berkas persyaratan.</p></header><SpmbForm /></main>; }

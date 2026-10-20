import { ThemeToggle } from "@/components/ThemeToggle";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return <><div className="border-b bg-white px-[21px] py-[8px] dark:bg-slate-900"><div className="mx-auto flex max-w-6xl justify-end"><ThemeToggle /></div></div>{children}</>;
}

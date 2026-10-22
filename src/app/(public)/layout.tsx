import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { getSiteSettings } from "@/lib/settings";
import { Breadcrumbs } from "@/components/Breadcrumbs";

export const revalidate = 60;
export default async function PublicLayout({children}:{children:React.ReactNode}){const {identity}=await getSiteSettings();return <><Navbar identity={identity}/><Breadcrumbs/><div id="konten-utama" tabIndex={-1}>{children}</div><SiteFooter identity={identity}/></>}

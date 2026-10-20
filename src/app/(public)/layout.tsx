import { Navbar } from "@/components/Navbar";
import { SiteFooter } from "@/components/SiteFooter";
import { getSiteSettings } from "@/lib/settings";

export const revalidate = 60;
export default async function PublicLayout({children}:{children:React.ReactNode}){const {identity}=await getSiteSettings();return <><Navbar/>{children}<SiteFooter identity={identity}/></>}

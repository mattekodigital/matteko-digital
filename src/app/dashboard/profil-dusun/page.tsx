import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getProfilDusun } from "@/lib/data/profil"
import ProfilDusunForm from "./_components/ProfilDusunForm"

export const dynamic = "force-dynamic"

export default async function DashboardProfilDusunPage() {
  const profil = await getProfilDusun()

  return (
    <SidebarProvider
      className="dashboard-sidebar"
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-[#0f172a] text-white">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 lg:p-6 gap-6">
          {/* Header */}
          <div>
            <h2 className="text-xl font-bold tracking-tight">Profil & Identitas Dusun</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Kelola informasi utama, visi, misi, dan kontak dusun
            </p>
          </div>

          <ProfilDusunForm initialData={profil} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

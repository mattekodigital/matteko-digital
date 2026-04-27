import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import type { ProfilDusun } from "@/lib/types"
import ProfilDusunForm from "./_components/ProfilDusunForm"

export default async function DashboardProfilDusunPage() {
  const supabase = await createClient()

  const { data: profilRaw } = await supabase
    .from("profil_dusun")
    .select("*")
    .limit(1)
    .single()

  const profil: ProfilDusun | null = profilRaw ?? null

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

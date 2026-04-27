import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import type { InfoWilayah, DataStatistik } from "@/lib/types"
import StatistikTabs from "./_components/StatistikTabs"

export default async function DashboardStatistikPage() {
  const supabase = await createClient()

  const [{ data: wilayahRaw }, { data: statistikRaw }] = await Promise.all([
    supabase
      .from("info_wilayah")
      .select("*")
      .order("id", { ascending: false })
      .limit(1)
      .maybeSingle(),
    supabase
      .from("data_statistik")
      .select("*")
      .order("urutan", { ascending: true }),
  ])

  const wilayah: InfoWilayah | null = wilayahRaw ?? null
  const statistik: DataStatistik[] = statistikRaw ?? []

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
            <h2 className="text-xl font-bold tracking-tight">Manajemen Statistik Desa</h2>
            <p className="text-slate-400 text-sm mt-0.5">
              Kelola data wilayah dan grafik statistik yang tampil di halaman publik
            </p>
          </div>

          <StatistikTabs initialWilayah={wilayah} initialStatistik={statistik} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

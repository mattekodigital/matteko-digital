import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { getAllDataStatistik, getLatestInfoWilayah } from "@/lib/data/statistik"
import StatistikTabs from "./_components/StatistikTabs"

export const dynamic = "force-dynamic"

export default async function DashboardStatistikPage() {
  const [wilayah, statistik] = await Promise.all([
    getLatestInfoWilayah(),
    getAllDataStatistik(),
  ])

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
            <h2 className="text-xl font-bold tracking-tight">Manajemen Statistik Dusun</h2>
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

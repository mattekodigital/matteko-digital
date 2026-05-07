import React from "react"
import Link from "next/link"
import { PlusCircleIcon } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { listAllInformasi } from "@/lib/data/informasi"
import { InformasiTableClient } from "./_components/informasi-table-client"

export const dynamic = "force-dynamic"

// ─── Page (Server Component — fetches all data once) ─────────────────────────
export default async function InformasiDesaDashboardPage() {
  const items = await listAllInformasi()

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
          {/* ── Page header ─────────────────────────────────────────────── */}
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                Manajemen Informasi Dusun
              </h2>
              <p className="text-slate-400 text-sm mt-0.5">
                Kelola semua berita, pengumuman, dan konten dusun
              </p>
            </div>
            <Link
              href="/dashboard/informasi-desa/tambah"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <PlusCircleIcon className="size-4" />
              Tambah Baru
            </Link>
          </div>

          {/* ── Interactive table (search + filter + pagination) ─────────── */}
          <InformasiTableClient items={items} />
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

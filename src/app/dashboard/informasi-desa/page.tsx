import Link from "next/link"
import { notFound } from "next/navigation"
import {
  PlusCircleIcon,
  PencilIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
} from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { createClient } from "@/lib/supabase/server"
import type { InformasiDesa } from "@/lib/types"

// ─── Helpers ──────────────────────────────────────────────────────────────────
const KATEGORI_COLOR: Record<InformasiDesa["kategori"], string> = {
  berita: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  pengumuman: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  agenda: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  galeri: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  wisata: "bg-green-500/20 text-green-300 border-green-500/30",
  umkm: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  pertanian: "bg-lime-500/20 text-lime-300 border-lime-500/30",
}

function formatDate(iso: string | null) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" })
}

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function InformasiDesaDashboardPage() {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from("informasi_dusun")
    .select("*")
    .order("created_at", { ascending: false })

  if (error) {
    console.error("Error fetching informasi_desa:", error.message)
  }

  const items: InformasiDesa[] = data ?? []

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
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-xl font-bold tracking-tight">Manajemen Informasi Desa</h2>
              <p className="text-slate-400 text-sm mt-0.5">Kelola semua berita, pengumuman, dan konten desa</p>
            </div>
            <Link
              href="/dashboard/informasi-desa/tambah"
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 text-white font-semibold px-4 py-2.5 rounded-xl text-sm transition-colors"
            >
              <PlusCircleIcon className="size-4" />
              Tambah Baru
            </Link>
          </div>

          {/* Table */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            {items.length === 0 ? (
              <div className="text-center py-20 text-slate-500">
                <TagIcon className="size-10 mx-auto mb-3 opacity-40" />
                <p className="font-medium">Belum ada data informasi desa.</p>
                <Link href="/dashboard/informasi-desa/tambah" className="text-blue-400 text-sm hover:underline mt-2 inline-block">
                  Tambah sekarang →
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">Judul</th>
                      <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">Kategori</th>
                      <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">Penulis</th>
                      <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">Tanggal</th>
                      <th className="text-right px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">Aksi</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/30">
                    {items.map((item) => (
                      <tr key={item.id} className="hover:bg-slate-700/20 transition-colors group">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {item.image_url && (
                              <img
                                src={item.image_url}
                                alt={item.judul}
                                className="size-10 rounded-lg object-cover border border-slate-700 shrink-0 hidden sm:block"
                              />
                            )}
                            <div className="min-w-0">
                              <p className="font-medium text-slate-100 truncate max-w-xs">{item.judul}</p>
                              {item.lokasi && (
                                <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                                  <MapPinIcon className="size-2.5" /> {item.lokasi}
                                </p>
                              )}
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden sm:table-cell">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border capitalize ${KATEGORI_COLOR[item.kategori]}`}>
                            {item.kategori}
                          </span>
                        </td>
                        <td className="px-5 py-4 hidden md:table-cell">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <UserIcon className="size-3" />
                            {item.penulis ?? "-"}
                          </div>
                        </td>
                        <td className="px-5 py-4 hidden lg:table-cell">
                          <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                            <CalendarIcon className="size-3" />
                            {formatDate(item.tanggal_kegiatan ?? item.created_at)}
                          </div>
                        </td>
                        <td className="px-5 py-4 text-right">
                          <Link
                            href={`/dashboard/informasi-desa/${item.id}/edit`}
                            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-700/50 hover:bg-blue-600 border border-slate-600/50 hover:border-blue-500 text-slate-300 hover:text-white text-xs font-medium transition-all"
                          >
                            <PencilIcon className="size-3" />
                            Edit
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

          <p className="text-xs text-slate-600 text-right">{items.length} item ditemukan</p>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

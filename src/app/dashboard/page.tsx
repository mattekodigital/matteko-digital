import Link from "next/link"
import { CalendarIcon, FileTextIcon, ImageIcon, EditIcon, PlusCircleIcon, BarChartIcon, TagIcon } from "lucide-react"
import { AppSidebar } from "@/components/app-sidebar"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"
import { countInformasi, listLatestInformasi } from "@/lib/data/informasi"
import type { InformasiDesa } from "@/lib/types"

export const dynamic = "force-dynamic"

// ─── Helpers ─────────────────────────────────────────────────────────────────
function formatDate(iso: string | null) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

function timeAgo(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)
  if (mins < 1) return "Baru saja"
  if (mins < 60) return `${mins} menit lalu`
  if (hours < 24) return `${hours} jam lalu`
  return `${days} hari lalu`
}

const KATEGORI_COLOR: Record<InformasiDesa["kategori"], string> = {
  berita: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  pengumuman: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  agenda: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  galeri: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  wisata: "bg-green-500/20 text-green-300 border-green-500/30",
  umkm: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  pertanian: "bg-lime-500/20 text-lime-300 border-lime-500/30",
}

// ─── Page ────────────────────────────────────────────────────────────────────
export default async function DashboardPage() {
  const [totalBerita, totalGaleri, totalInformasi, latestItems] = await Promise.all([
    countInformasi("berita"),
    countInformasi("galeri"),
    countInformasi(),
    listLatestInformasi(5),
  ])

  const now = new Date()

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

          {/* Welcome Section */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight">
                Selamat Datang, Administrator Dusun 👋
              </h2>
              <p className="text-slate-400 mt-1">
                Berikut adalah ringkasan aktivitas di dusun digital Anda hari ini.
              </p>
            </div>
            <div className="flex items-center gap-2 bg-slate-800/50 px-4 py-2 rounded-md border border-slate-700/50">
              <CalendarIcon className="size-4 text-slate-400" />
              <span className="text-sm font-medium text-slate-300">
                {formatDate(now.toISOString())}
              </span>
            </div>
          </div>

          {/* Stat Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <StatCard
              title="TOTAL BERITA"
              count={String(totalBerita ?? 0)}
              label="Terpublikasi"
              icon={<FileTextIcon className="size-5 text-blue-400" />}
              iconBg="bg-blue-500/10"
              textColor="text-blue-400"
            />
            <StatCard
              title="TOTAL KONTEN"
              count={String(totalInformasi ?? 0)}
              label="Semua Kategori"
              icon={<TagIcon className="size-5 text-purple-400" />}
              iconBg="bg-purple-500/10"
              textColor="text-purple-400"
            />
            <StatCard
              title="GALERI FOTO"
              count={String(totalGaleri ?? 0)}
              label="Item Galeri"
              icon={<ImageIcon className="size-5 text-pink-400" />}
              iconBg="bg-pink-500/10"
              textColor="text-pink-400"
            />
          </div>

          {/* Main Content Areas */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

            {/* Aksi Cepat */}
            <div className="col-span-1 bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 md:p-5">
              <h3 className="font-semibold mb-4 text-slate-200">Aksi Cepat</h3>
              <div className="flex flex-col gap-3">
                <Link
                  href="/dashboard/informasi-dusun/tambah"
                  className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-left transition-colors border border-slate-700"
                >
                  <div className="bg-blue-500/10 p-2.5 rounded-md">
                    <EditIcon className="size-5 text-blue-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-200">Tulis Konten Baru</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Berita, pengumuman, agenda, galeri
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/statistik"
                  className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-left transition-colors border border-slate-700"
                >
                  <div className="bg-green-500/10 p-2.5 rounded-md">
                    <BarChartIcon className="size-5 text-green-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-200">Kelola Statistik</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Data wilayah & demografis
                    </div>
                  </div>
                </Link>

                <Link
                  href="/dashboard/informasi-dusun"
                  className="flex items-center gap-4 bg-slate-800 hover:bg-slate-700 p-3 rounded-lg text-left transition-colors border border-slate-700"
                >
                  <div className="bg-purple-500/10 p-2.5 rounded-md">
                    <PlusCircleIcon className="size-5 text-purple-400" />
                  </div>
                  <div>
                    <div className="font-medium text-sm text-slate-200">Lihat Semua Konten</div>
                    <div className="text-xs text-slate-400 mt-0.5">
                      Kelola seluruh informasi dusun
                    </div>
                  </div>
                </Link>
              </div>
            </div>

            {/* Konten Terbaru */}
            <div className="col-span-1 lg:col-span-2 bg-slate-800/40 rounded-xl border border-slate-700/50 p-4 md:p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-semibold text-slate-200">Konten Terbaru Diterbitkan</h3>
                <Link
                  href="/dashboard/informasi-dusun"
                  className="text-xs text-blue-400 hover:text-blue-300 transition-colors"
                >
                  Lihat semua →
                </Link>
              </div>

              {latestItems.length === 0 ? (
                <div className="text-center py-10 text-slate-500">
                  <FileTextIcon className="size-8 mx-auto mb-2 opacity-40" />
                  <p className="text-sm">Belum ada konten diterbitkan.</p>
                  <Link
                    href="/dashboard/informasi-dusun/tambah"
                    className="text-blue-400 text-xs hover:underline mt-1 inline-block"
                  >
                    Tambah konten pertama →
                  </Link>
                </div>
              ) : (
                <div className="flex flex-col gap-3">
                  {latestItems.map((item) => (
                    <NewsItem
                      key={item.id}
                      id={item.id}
                      title={item.judul}
                      category={item.kategori}
                      time={timeAgo(item.created_at)}
                      image={item.image_url}
                      categoryColor={KATEGORI_COLOR[item.kategori]}
                    />
                  ))}
                </div>
              )}
            </div>

          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({
  title,
  count,
  label,
  icon,
  iconBg,
  textColor,
}: {
  title: string
  count: string
  label: string
  icon: React.ReactNode
  iconBg: string
  textColor: string
}) {
  return (
    <div className="bg-slate-800/40 p-5 rounded-xl border border-slate-700/50 flex justify-between items-center relative overflow-hidden">
      <div className="z-10">
        <h4 className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-2">
          {title}
        </h4>
        <div className="flex items-end gap-2">
          <span className="text-3xl font-bold leading-none text-slate-100">{count}</span>
          <span className={`text-xs mb-1 ${textColor}`}>{label}</span>
        </div>
      </div>
      <div className={`p-3.5 rounded-lg z-10 ${iconBg}`}>{icon}</div>
    </div>
  )
}

function NewsItem({
  id,
  title,
  category,
  time,
  image,
  categoryColor,
}: {
  id: string
  title: string
  category: string
  time: string
  image: string | null
  categoryColor: string
}) {
  return (
    <Link
      href={`/dashboard/informasi-dusun/${id}/edit`}
      className="flex items-center gap-4 bg-slate-800/80 p-3 rounded-lg border border-slate-700/50 hover:bg-slate-700 transition-colors group"
    >
      <div className="w-16 h-12 bg-slate-700 rounded overflow-hidden shrink-0">
        {image ? (
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <FileTextIcon className="size-5 text-slate-500" />
          </div>
        )}
      </div>
      <div className="flex-1 min-w-0">
        <h4 className="font-medium text-sm text-slate-200 truncate">{title}</h4>
        <div className="flex items-center gap-2 mt-1">
          <span
            className={`text-[10px] tracking-wider font-semibold px-2 py-0.5 rounded-full border capitalize ${categoryColor}`}
          >
            {category}
          </span>
          <span className="text-xs text-slate-400">{time}</span>
        </div>
      </div>
    </Link>
  )
}

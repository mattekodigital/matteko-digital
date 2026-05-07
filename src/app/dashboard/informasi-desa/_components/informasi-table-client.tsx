"use client"

import { useState, useMemo } from "react"
import Link from "next/link"
import {
  PencilIcon,
  CalendarIcon,
  UserIcon,
  MapPinIcon,
  TagIcon,
  SearchIcon,
  FilterIcon,
} from "lucide-react"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import type { InformasiDesa } from "@/lib/types"

// ─── Kategori config ──────────────────────────────────────────────────────────
const KATEGORI_COLOR: Record<InformasiDesa["kategori"], string> = {
  berita: "bg-blue-500/20 text-blue-300 border-blue-500/30",
  pengumuman: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30",
  agenda: "bg-purple-500/20 text-purple-300 border-purple-500/30",
  galeri: "bg-pink-500/20 text-pink-300 border-pink-500/30",
  wisata: "bg-green-500/20 text-green-300 border-green-500/30",
  umkm: "bg-orange-500/20 text-orange-300 border-orange-500/30",
  pertanian: "bg-lime-500/20 text-lime-300 border-lime-500/30",
}

const KATEGORI_LABEL: Record<InformasiDesa["kategori"], string> = {
  berita: "Berita",
  pengumuman: "Pengumuman",
  agenda: "Agenda",
  galeri: "Galeri",
  wisata: "Wisata",
  umkm: "UMKM",
  pertanian: "Pertanian",
}

const ALL_KATEGORI = Object.keys(KATEGORI_LABEL) as InformasiDesa["kategori"][]

function formatDate(iso: string | null) {
  if (!iso) return "-"
  return new Date(iso).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  })
}

// ─── Component ────────────────────────────────────────────────────────────────
export function InformasiTableClient({ items }: { items: InformasiDesa[] }) {
  const [search, setSearch] = useState("")
  const [kategori, setKategori] = useState<string>("semua")
  const [rowsPerPage, setRowsPerPage] = useState(10)
  const [page, setPage] = useState(1)

  // ── Filter & search ────────────────────────────────────────────────────────
  const filtered = useMemo(() => {
    const q = search.toLowerCase().trim()
    return items.filter((item) => {
      const matchKategori = kategori === "semua" || item.kategori === kategori
      const matchSearch =
        !q ||
        item.judul.toLowerCase().includes(q) ||
        (item.penulis ?? "").toLowerCase().includes(q) ||
        (item.lokasi ?? "").toLowerCase().includes(q) ||
        item.kategori.toLowerCase().includes(q)
      return matchKategori && matchSearch
    })
  }, [items, search, kategori])

  // ── Pagination ─────────────────────────────────────────────────────────────
  const totalPages = Math.max(1, Math.ceil(filtered.length / rowsPerPage))
  const safePage = Math.min(page, totalPages)
  const start = (safePage - 1) * rowsPerPage
  const paginated = filtered.slice(start, start + rowsPerPage)

  function handleSearch(val: string) {
    setSearch(val)
    setPage(1)
  }
  function handleKategori(val: string) {
    setKategori(val)
    setPage(1)
  }
  function handleRowsPerPage(val: string) {
    setRowsPerPage(Number(val))
    setPage(1)
  }

  // ── Empty state ────────────────────────────────────────────────────────────
  const isEmpty = paginated.length === 0

  return (
    <div className="flex flex-col gap-4">
      {/* ── Toolbar ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="flex flex-1 items-center gap-2.5 h-9 px-3 rounded-xl border border-slate-700/60 bg-slate-800/60 focus-within:border-blue-500 focus-within:ring-2 focus-within:ring-blue-500/20 transition-all">
          <SearchIcon className="size-4 text-slate-400 shrink-0" />
          <input
            id="informasi-search"
            type="text"
            placeholder="Cari judul, penulis, lokasi, atau kategori…"
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            className="flex-1 bg-transparent text-sm text-slate-100 placeholder:text-slate-500 outline-none min-w-0"
          />
        </div>

        {/* Kategori filter */}
        <div className="flex items-center gap-2">
          <FilterIcon className="size-4 text-slate-400 shrink-0" />
          <Select value={kategori} onValueChange={handleKategori}>
            <SelectTrigger
              id="filter-kategori"
              className="w-40 h-9 border-slate-700/60 bg-slate-800/60 text-slate-100 text-sm rounded-xl focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20"
            >
              <SelectValue placeholder="Semua Kategori" />
            </SelectTrigger>
            <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
              <SelectGroup>
                <SelectItem value="semua">Semua Kategori</SelectItem>
                {ALL_KATEGORI.map((k) => (
                  <SelectItem key={k} value={k}>
                    {KATEGORI_LABEL[k]}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* ── Table ───────────────────────────────────────────────────────── */}
      <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
        {isEmpty ? (
          <div className="text-center py-20 text-slate-500">
            <TagIcon className="size-10 mx-auto mb-3 opacity-40" />
            <p className="font-medium">
              {search || kategori !== "semua"
                ? "Tidak ada data yang cocok dengan pencarian."
                : "Belum ada data informasi dusun."}
            </p>
            {!search && kategori === "semua" && (
              <Link
                href="/dashboard/informasi-desa/tambah"
                className="text-blue-400 text-sm hover:underline mt-2 inline-block"
              >
                Tambah sekarang →
              </Link>
            )}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700/50">
                  <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Judul
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden sm:table-cell">
                    Kategori
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden md:table-cell">
                    Penulis
                  </th>
                  <th className="text-left px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider hidden lg:table-cell">
                    Tanggal
                  </th>
                  <th className="text-right px-5 py-3.5 text-xs text-slate-400 font-semibold uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700/30">
                {paginated.map((item) => (
                  <tr
                    key={item.id}
                    className="hover:bg-slate-700/20 transition-colors group"
                  >
                    {/* Judul */}
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
                          <p className="font-medium text-slate-100 truncate max-w-xs">
                            {item.judul}
                          </p>
                          {item.lokasi && (
                            <p className="text-xs text-slate-500 flex items-center gap-1 mt-0.5">
                              <MapPinIcon className="size-2.5" />
                              {item.lokasi}
                            </p>
                          )}
                        </div>
                      </div>
                    </td>

                    {/* Kategori badge */}
                    <td className="px-5 py-4 hidden sm:table-cell">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-lg text-[11px] font-semibold border capitalize ${KATEGORI_COLOR[item.kategori]}`}
                      >
                        {KATEGORI_LABEL[item.kategori]}
                      </span>
                    </td>

                    {/* Penulis */}
                    <td className="px-5 py-4 hidden md:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <UserIcon className="size-3" />
                        {item.penulis ?? "-"}
                      </div>
                    </td>

                    {/* Tanggal */}
                    <td className="px-5 py-4 hidden lg:table-cell">
                      <div className="flex items-center gap-1.5 text-slate-400 text-xs">
                        <CalendarIcon className="size-3" />
                        {formatDate(item.tanggal_kegiatan ?? item.created_at)}
                      </div>
                    </td>

                    {/* Aksi */}
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

      {/* ── Footer: rows info + pagination ──────────────────────────────── */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        {/* Info */}
        <p className="text-xs text-slate-500">
          Menampilkan{" "}
          <span className="text-slate-300 font-medium">
            {filtered.length === 0 ? 0 : start + 1}–{Math.min(start + rowsPerPage, filtered.length)}
          </span>{" "}
          dari <span className="text-slate-300 font-medium">{filtered.length}</span> item
          {items.length !== filtered.length && (
            <span className="text-slate-600"> (total {items.length})</span>
          )}
        </p>

        {/* Rows per page + pagination */}
        <div className="flex items-center justify-between gap-4 w-full sm:w-auto">
          <Field orientation="horizontal" className="w-fit">
            <FieldLabel htmlFor="select-rows-per-page" className="text-slate-400">
              Baris/halaman
            </FieldLabel>
            <Select
              value={String(rowsPerPage)}
              onValueChange={handleRowsPerPage}
            >
              <SelectTrigger
                className="w-20 h-8 border-slate-700/60 bg-slate-800/60 text-slate-100 text-sm rounded-lg"
                id="select-rows-per-page"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="bg-slate-800 border-slate-700 text-slate-100">
                <SelectGroup>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          <Pagination className="mx-0 w-auto">
            <PaginationContent>
              <PaginationItem>
                <PaginationPrevious
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.max(1, p - 1))
                  }}
                  aria-disabled={safePage <= 1}
                  className={
                    safePage <= 1
                      ? "pointer-events-none opacity-40"
                      : "text-slate-300 hover:text-white"
                  }
                  text="Prev"
                />
              </PaginationItem>
              <PaginationItem>
                <span className="text-xs text-slate-400 px-2 tabular-nums">
                  {safePage} / {totalPages}
                </span>
              </PaginationItem>
              <PaginationItem>
                <PaginationNext
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    setPage((p) => Math.min(totalPages, p + 1))
                  }}
                  aria-disabled={safePage >= totalPages}
                  className={
                    safePage >= totalPages
                      ? "pointer-events-none opacity-40"
                      : "text-slate-300 hover:text-white"
                  }
                  text="Next"
                />
              </PaginationItem>
            </PaginationContent>
          </Pagination>
        </div>
      </div>
    </div>
  )
}

"use client"

import React, { useState, useRef, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  ArrowLeftIcon,
  SaveIcon,
  SendIcon,
  ImageIcon,
  XCircleIcon,
  Loader2Icon,
  MapPinIcon,
  CalendarIcon,
  UserIcon,
  FileTextIcon,
  TagIcon,
  EyeIcon,
  CheckCircle2Icon,
  AlertCircleIcon,
} from "lucide-react"
import { createClient } from "@/lib/supabase/client"
import type { InformasiDesa } from "@/lib/types"

// ─── Types ────────────────────────────────────────────────────────────────────
type Kategori = InformasiDesa["kategori"]

interface FormData {
  kategori: Kategori
  judul: string
  konten: string
  image_url: string
  penulis: string
  tanggal_kegiatan: string
  lokasi: string
}

interface Props {
  mode: "create" | "edit"
  initialData?: InformasiDesa
}

// ─── Constants ────────────────────────────────────────────────────────────────
const KATEGORI_OPTIONS: { value: Kategori; label: string; color: string }[] = [
  { value: "berita", label: "Berita", color: "bg-blue-500/20 text-blue-300 border-blue-500/30" },
  { value: "pengumuman", label: "Pengumuman", color: "bg-yellow-500/20 text-yellow-300 border-yellow-500/30" },
  { value: "agenda", label: "Agenda", color: "bg-purple-500/20 text-purple-300 border-purple-500/30" },
  { value: "galeri", label: "Galeri", color: "bg-pink-500/20 text-pink-300 border-pink-500/30" },
  { value: "wisata", label: "Wisata", color: "bg-green-500/20 text-green-300 border-green-500/30" },
  { value: "umkm", label: "UMKM", color: "bg-orange-500/20 text-orange-300 border-orange-500/30" },
  { value: "pertanian", label: "Pertanian", color: "bg-lime-500/20 text-lime-300 border-lime-500/30" },
]

function formatDatetimeLocal(iso: string | null): string {
  if (!iso) return ""
  try {
    const d = new Date(iso)
    const pad = (n: number) => String(n).padStart(2, "0")
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
  } catch {
    return ""
  }
}

function formatPreviewDate(iso: string): string {
  if (!iso) return new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  try {
    return new Date(iso).toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" })
  } catch {
    return "-"
  }
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function InformasiDesaForm({ mode, initialData }: Props) {
  const router = useRouter()
  const supabase = createClient()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [form, setForm] = useState<FormData>({
    kategori: initialData?.kategori ?? "berita",
    judul: initialData?.judul ?? "",
    konten: initialData?.konten ?? "",
    image_url: initialData?.image_url ?? "",
    penulis: initialData?.penulis ?? "Administrator Dusun",
    tanggal_kegiatan: formatDatetimeLocal(initialData?.tanggal_kegiatan ?? null),
    lokasi: initialData?.lokasi ?? "",
  })

  const [imagePreview, setImagePreview] = useState<string>(initialData?.image_url ?? "")
  const [uploading, setUploading] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormData, string>>>({})
  const [activeTab, setActiveTab] = useState<"form" | "preview">("form")

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const update = useCallback(<K extends keyof FormData>(key: K, value: FormData[K]) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof FormData, string>> = {}
    if (!form.judul.trim()) newErrors.judul = "Judul wajib diisi"
    if (!form.konten.trim()) newErrors.konten = "Konten wajib diisi"
    if (!form.penulis.trim()) newErrors.penulis = "Penulis wajib diisi"
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  // ── Image upload ──────────────────────────────────────────────────────────
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Local preview immediately
    const objectUrl = URL.createObjectURL(file)
    setImagePreview(objectUrl)

    setUploading(true)
    try {
      const ext = file.name.split(".").pop()
      const fileName = `informasi/${Date.now()}.${ext}`
      const { data, error } = await supabase.storage.from("images").upload(fileName, file, { upsert: true })
      if (error) throw error

      const { data: publicData } = supabase.storage.from("images").getPublicUrl(data.path)
      update("image_url", publicData.publicUrl)
      setImagePreview(publicData.publicUrl)
      showToast("success", "Gambar berhasil diunggah")
    } catch (err: unknown) {
      showToast("error", `Gagal mengunggah gambar: ${err instanceof Error ? err.message : "Unknown error"}`)
      setImagePreview(form.image_url)
    } finally {
      setUploading(false)
    }
  }

  const removeImage = () => {
    setImagePreview("")
    update("image_url", "")
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  // ── Submit ────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const payload = {
      kategori: form.kategori,
      judul: form.judul.trim(),
      konten: form.konten.trim(),
      image_url: form.image_url || null,
      penulis: form.penulis.trim(),
      tanggal_kegiatan: form.tanggal_kegiatan ? new Date(form.tanggal_kegiatan).toISOString() : null,
      lokasi: form.lokasi.trim() || null,
    }

    try {
      if (mode === "create") {
        const { error } = await supabase.from("informasi_dusun").insert([payload])
        if (error) throw error
        showToast("success", "Data berhasil ditambahkan!")
      } else {
        const { error } = await supabase.from("informasi_dusun").update(payload).eq("id", initialData!.id)
        if (error) throw error
        showToast("success", "Data berhasil diperbarui!")
      }
      setTimeout(() => router.push("/dashboard/informasi-desa"), 1200)
    } catch (err: unknown) {
      const errorMessage = err && typeof err === 'object' && 'message' in err 
        ? String(err.message) 
        : err instanceof Error ? err.message : "Unknown error"
      showToast("error", `Gagal menyimpan: ${errorMessage}`)
    } finally {
      setSubmitting(false)
    }
  }

  const selectedKategori = KATEGORI_OPTIONS.find((k) => k.value === form.kategori)

  // ─── Render ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-full bg-[#0f172a] text-white">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all duration-300 ${
            toast.type === "success"
              ? "bg-green-900/90 border-green-500/40 text-green-200"
              : "bg-red-900/90 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? <CheckCircle2Icon className="size-4 shrink-0" /> : <AlertCircleIcon className="size-4 shrink-0" />}
          {toast.message}
        </div>
      )}

      {/* Page Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 rounded-lg bg-slate-800 hover:bg-slate-700 border border-slate-700 transition-colors"
          >
            <ArrowLeftIcon className="size-4 text-slate-300" />
          </button>
          <div>
            <h2 className="text-xl font-bold tracking-tight">
              {mode === "create" ? "Tambah Informasi Desa" : "Edit Informasi Desa"}
            </h2>
            <p className="text-slate-400 text-sm mt-0.5">
              {mode === "create" ? "Buat konten baru untuk dipublikasikan" : "Perbarui data informasi yang ada"}
            </p>
          </div>
        </div>

        {/* Mobile tab toggle */}
        <div className="flex lg:hidden items-center bg-slate-800 border border-slate-700 rounded-lg p-0.5">
          <button
            onClick={() => setActiveTab("form")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === "form" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Form
          </button>
          <button
            onClick={() => setActiveTab("preview")}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${activeTab === "preview" ? "bg-blue-600 text-white" : "text-slate-400 hover:text-white"}`}
          >
            Preview
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left: Main Form ── */}
          <div className={`lg:col-span-2 space-y-5 ${activeTab === "preview" ? "hidden lg:block" : "block"}`}>

            {/* Kategori */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <TagIcon className="size-3.5" /> Kategori
              </label>
              <div className="flex flex-wrap gap-2">
                {KATEGORI_OPTIONS.map((k) => (
                  <button
                    key={k.value}
                    type="button"
                    onClick={() => update("kategori", k.value)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                      form.kategori === k.value
                        ? k.color + " scale-105 shadow-sm"
                        : "bg-slate-700/50 text-slate-400 border-slate-600/50 hover:bg-slate-700"
                    }`}
                  >
                    {k.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Judul */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <label htmlFor="judul" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <FileTextIcon className="size-3.5" /> Judul <span className="text-red-400">*</span>
              </label>
              <input
                id="judul"
                type="text"
                value={form.judul}
                onChange={(e) => update("judul", e.target.value)}
                placeholder="Tulis judul yang menarik..."
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                  errors.judul ? "border-red-500/70 focus:ring-red-500/30" : "border-slate-600/50 focus:ring-blue-500/30 focus:border-blue-500/50"
                }`}
              />
              {errors.judul && <p className="text-red-400 text-xs mt-2 flex items-center gap-1"><AlertCircleIcon className="size-3" />{errors.judul}</p>}
            </div>

            {/* Konten */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <label htmlFor="konten" className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <FileTextIcon className="size-3.5" /> Konten <span className="text-red-400">*</span>
              </label>
              <textarea
                id="konten"
                rows={10}
                value={form.konten}
                onChange={(e) => update("konten", e.target.value)}
                placeholder="Tulis konten lengkap di sini..."
                className={`w-full bg-slate-900/50 border rounded-xl px-4 py-3 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all resize-none leading-relaxed ${
                  errors.konten ? "border-red-500/70 focus:ring-red-500/30" : "border-slate-600/50 focus:ring-blue-500/30 focus:border-blue-500/50"
                }`}
              />
              <div className="flex justify-between mt-2">
                {errors.konten && <p className="text-red-400 text-xs flex items-center gap-1"><AlertCircleIcon className="size-3" />{errors.konten}</p>}
                <span className="ml-auto text-xs text-slate-500">{form.konten.length} karakter</span>
              </div>
            </div>

            {/* Image Upload */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <label className="flex items-center gap-2 text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
                <ImageIcon className="size-3.5" /> Gambar Utama
              </label>

              {imagePreview ? (
                <div className="relative group">
                  <img
                    src={imagePreview}
                    alt="Preview"
                    className="w-full h-52 object-cover rounded-xl border border-slate-600/50"
                  />
                  {uploading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 rounded-xl">
                      <Loader2Icon className="size-8 animate-spin text-blue-400" />
                    </div>
                  )}
                  {!uploading && (
                    <button
                      type="button"
                      onClick={removeImage}
                      className="absolute top-2 right-2 p-1.5 bg-red-600/80 hover:bg-red-600 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <XCircleIcon className="size-4" />
                    </button>
                  )}
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full h-40 border-2 border-dashed border-slate-600/60 hover:border-blue-500/50 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-blue-400 transition-all group"
                >
                  {uploading ? (
                    <Loader2Icon className="size-6 animate-spin" />
                  ) : (
                    <>
                      <ImageIcon className="size-8 group-hover:scale-110 transition-transform" />
                      <span className="text-sm font-medium">Klik untuk unggah gambar</span>
                      <span className="text-xs">JPG, PNG, WEBP — Maks 5MB</span>
                    </>
                  )}
                </button>
              )}

              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />

              {/* OR: paste URL */}
              <div className="mt-3">
                <p className="text-xs text-slate-500 mb-1.5">Atau tempel URL gambar langsung:</p>
                <input
                  type="url"
                  value={form.image_url}
                  onChange={(e) => {
                    update("image_url", e.target.value)
                    setImagePreview(e.target.value)
                  }}
                  placeholder="https://..."
                  className="w-full bg-slate-900/50 border border-slate-600/50 rounded-lg px-3 py-2 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 focus:ring-blue-500/30"
                />
              </div>
            </div>

            {/* Meta Fields */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5 space-y-4">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Informasi Tambahan</h3>

              {/* Penulis */}
              <div>
                <label htmlFor="penulis" className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <UserIcon className="size-3.5" /> Penulis <span className="text-red-400">*</span>
                </label>
                <input
                  id="penulis"
                  type="text"
                  value={form.penulis}
                  onChange={(e) => update("penulis", e.target.value)}
                  placeholder="Nama penulis"
                  className={`w-full bg-slate-900/50 border rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                    errors.penulis ? "border-red-500/70 focus:ring-red-500/30" : "border-slate-600/50 focus:ring-blue-500/30"
                  }`}
                />
                {errors.penulis && <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1"><AlertCircleIcon className="size-3" />{errors.penulis}</p>}
              </div>

              {/* Tanggal Kegiatan */}
              <div>
                <label htmlFor="tanggal_kegiatan" className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <CalendarIcon className="size-3.5" /> Tanggal Kegiatan <span className="text-slate-600 text-[10px]">(opsional)</span>
                </label>
                <input
                  id="tanggal_kegiatan"
                  type="datetime-local"
                  value={form.tanggal_kegiatan}
                  onChange={(e) => update("tanggal_kegiatan", e.target.value)}
                  className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>

              {/* Lokasi */}
              <div>
                <label htmlFor="lokasi" className="flex items-center gap-2 text-xs text-slate-400 mb-1.5">
                  <MapPinIcon className="size-3.5" /> Lokasi <span className="text-slate-600 text-[10px]">(opsional)</span>
                </label>
                <input
                  id="lokasi"
                  type="text"
                  value={form.lokasi}
                  onChange={(e) => update("lokasi", e.target.value)}
                  placeholder="cth: Balai Desa Matteko"
                  className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition-all"
                />
              </div>
            </div>
          </div>

          {/* ── Right: Preview + Actions ── */}
          <div className={`space-y-5 ${activeTab === "form" ? "hidden lg:block" : "block"}`}>
            {/* Actions */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Aksi</h3>

              <button
                type="submit"
                disabled={submitting || uploading}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                {submitting ? (
                  <><Loader2Icon className="size-4 animate-spin" /> Menyimpan...</>
                ) : (
                  <><SendIcon className="size-4" /> {mode === "create" ? "Publikasikan" : "Simpan Perubahan"}</>
                )}
              </button>

              <button
                type="button"
                disabled={submitting}
                onClick={() => router.back()}
                className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 font-medium py-2.5 rounded-xl transition-all text-sm"
              >
                <ArrowLeftIcon className="size-4" /> Batal & Kembali
              </button>

              <div className="pt-1 border-t border-slate-700/50">
                <p className="text-[11px] text-slate-500 text-center">
                  {mode === "create" ? "Data akan langsung ditampilkan di halaman publik." : "Perubahan langsung tersimpan ke database."}
                </p>
              </div>
            </div>

            {/* Live Preview Card */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <div className="flex items-center gap-2 mb-4">
                <EyeIcon className="size-4 text-slate-400" />
                <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Pratinjau Konten</h3>
              </div>

              {/* Preview Card */}
              <div className="bg-white rounded-xl overflow-hidden shadow-lg">
                {/* Image */}
                <div className="relative h-36 bg-gray-200 overflow-hidden">
                  {imagePreview ? (
                    <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="size-8 text-gray-300" />
                    </div>
                  )}
                  {/* Category badge */}
                  <div className="absolute top-2 left-2 bg-blue-600 text-white text-[9px] font-bold px-2 py-0.5 rounded-full uppercase tracking-wide">
                    {selectedKategori?.label ?? "Kategori"}
                  </div>
                </div>

                {/* Card body */}
                <div className="p-3">
                  <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-1.5">
                    <CalendarIcon className="size-2.5" />
                    <span>{form.tanggal_kegiatan ? formatPreviewDate(form.tanggal_kegiatan) : formatPreviewDate("")}</span>
                    {form.penulis && (
                      <>
                        <span>·</span>
                        <UserIcon className="size-2.5" />
                        <span>{form.penulis}</span>
                      </>
                    )}
                  </div>
                  <h4 className="font-bold text-gray-800 text-xs leading-snug line-clamp-2 mb-1">
                    {form.judul || <span className="text-gray-300 italic">Judul belum diisi...</span>}
                  </h4>
                  <p className="text-gray-500 text-[10px] line-clamp-2">
                    {form.konten || <span className="italic">Konten belum diisi...</span>}
                  </p>
                  {form.lokasi && (
                    <div className="flex items-center gap-1 mt-1.5 text-[10px] text-gray-400">
                      <MapPinIcon className="size-2.5" />
                      <span>{form.lokasi}</span>
                    </div>
                  )}
                </div>
              </div>

              <p className="text-[11px] text-slate-500 text-center mt-3">
                Ini adalah tampilan perkiraan di halaman publik
              </p>
            </div>

            {/* Status */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5 space-y-2.5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Status Validasi</h3>
              {[
                { label: "Kategori", valid: !!form.kategori },
                { label: "Judul", valid: form.judul.trim().length > 0 },
                { label: "Konten", valid: form.konten.trim().length > 0 },
                { label: "Penulis", valid: form.penulis.trim().length > 0 },
                { label: "Gambar", valid: !!form.image_url, optional: true },
                { label: "Tanggal Kegiatan", valid: !!form.tanggal_kegiatan, optional: true },
                { label: "Lokasi", valid: !!form.lokasi, optional: true },
              ].map((item) => (
                <div key={item.label} className="flex items-center justify-between text-xs">
                  <span className={item.optional ? "text-slate-500" : "text-slate-300"}>
                    {item.label} {item.optional && <span className="text-[10px] text-slate-600">(opsional)</span>}
                  </span>
                  {item.valid ? (
                    <CheckCircle2Icon className="size-3.5 text-green-400" />
                  ) : item.optional ? (
                    <span className="size-3.5 inline-block rounded-full border border-slate-600" />
                  ) : (
                    <span className="size-3.5 inline-block rounded-full border border-red-500/50 bg-red-500/10" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

"use client"

import * as React from "react"
import { useRef, useState, useCallback } from "react"
import { useRouter } from "next/navigation"
import {
  SaveIcon,
  Loader2Icon,
  CheckCircle2Icon,
  AlertCircleIcon,
  RefreshCwIcon,
  MapPinIcon,
  UserIcon,
  PhoneIcon,
  ImageIcon,
  EyeIcon,
  XCircleIcon,
  UploadCloudIcon,
  BookOpenIcon,
  MessageSquareIcon,
} from "lucide-react"
import { saveProfilDusunAction } from "../_actions"
import type { ProfilDusun } from "@/lib/types"

interface ProfilDusunFormProps {
  initialData: ProfilDusun | null
}

type FormData = Partial<ProfilDusun>

function toFormData(d: ProfilDusun | null): FormData {
  return {
    nama_dusun: d?.nama_dusun ?? "",
    nama_desa: d?.nama_desa ?? "",
    nama_kecamatan: d?.nama_kecamatan ?? "",
    nama_kabupaten: d?.nama_kabupaten ?? "",
    nama_provinsi: d?.nama_provinsi ?? "Sulawesi Selatan",
    kode_pos: d?.kode_pos ?? "",
    nama_kepala_dusun: d?.nama_kepala_dusun ?? "",
    foto_kepala_dusun: d?.foto_kepala_dusun ?? "",
    pesan_sambutan: d?.pesan_sambutan ?? "",
    sejarah_dusun: d?.sejarah_dusun ?? "",
    visi: d?.visi ?? "",
    misi: d?.misi ?? "",
    email: d?.email ?? "",
    no_telepon: d?.no_telepon ?? "",
    alamat_kantor: d?.alamat_kantor ?? "",
    link_facebook: d?.link_facebook ?? "",
    link_instagram: d?.link_instagram ?? "",
    link_youtube: d?.link_youtube ?? "",
    url_logo: d?.url_logo ?? "",
    url_banner: d?.url_banner ?? "",
  }
}

// Reusable input style
const inputCls =
  "w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"

const textareaCls =
  "w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all resize-none"

export default function ProfilDusunForm({ initialData }: ProfilDusunFormProps) {
  const router = useRouter()
  const [isSaving, setIsSaving] = React.useState(false)
  const [toast, setToast] = React.useState<{ type: "success" | "error"; message: string } | null>(null)
  const [formData, setFormData] = React.useState<FormData>(toFormData(initialData))

  // ── Foto Kepala Dusun Upload State ─────────────────────────────────────────
  const fotoInputRef = useRef<HTMLInputElement>(null)
  const [fotoPreview, setFotoPreview] = useState<string>(initialData?.foto_kepala_dusun ?? "")
  const [uploadingFoto, setUploadingFoto] = useState(false)
  // fotoUrlInput: hanya untuk input URL manual — tidak pernah diisi path lokal
  const initialFotoIsUrl = /^https?:\/\//i.test(initialData?.foto_kepala_dusun ?? "")
  const [fotoUrlInput, setFotoUrlInput] = useState<string>(initialFotoIsUrl ? (initialData?.foto_kepala_dusun ?? "") : "")
  const [checkingFotoUrl, setCheckingFotoUrl] = useState(false)
  const [fotoUrlError, setFotoUrlError] = useState<string>("")

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const update = (key: keyof FormData, value: string) => {
    setFormData((prev) => ({ ...prev, [key]: value }))
  }

  const handleReset = () => {
    setFormData(toFormData(initialData))
    setFotoPreview(initialData?.foto_kepala_dusun ?? "")
    setFotoUrlInput(initialFotoIsUrl ? (initialData?.foto_kepala_dusun ?? "") : "")
    setFotoUrlError("")
  }

  // ── Foto Kepala Dusun: Upload ke storage lokal ──────────────────────────
  const handleFotoChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    // Preview lokal instan
    const objectUrl = URL.createObjectURL(file)
    setFotoPreview(objectUrl)
    setUploadingFoto(true)

    try {
      const body = new FormData()
      body.append("file", file)
      body.append("folder", "kepala-dusun")

      const response = await fetch("/api/uploads", {
        method: "POST",
        body,
      })
      const contentType = response.headers.get("content-type") ?? ""
      const result = contentType.includes("application/json")
        ? ((await response.json()) as { url?: string; error?: string })
        : { error: await response.text() }
      if (!response.ok || !result.url) {
        throw new Error(result.error ?? "Upload gagal")
      }

      update("foto_kepala_dusun", result.url)
      setFotoPreview(result.url)
      showToast("success", "Foto kepala dusun berhasil diunggah")
    } catch (err: unknown) {
      showToast(
        "error",
        `Gagal mengunggah foto: ${err instanceof Error ? err.message : "Unknown error"}`
      )
    } finally {
      setUploadingFoto(false)
      if (fotoInputRef.current) fotoInputRef.current.value = ""
    }
  }

  const removeFoto = () => {
    setFotoPreview("")
    update("foto_kepala_dusun", "")
    setFotoUrlInput("")
    setFotoUrlError("")
    if (fotoInputRef.current) fotoInputRef.current.value = ""
  }

  // ── Verifikasi URL foto (sama dengan pola di InformasiDesaForm) ─────────────
  const verifyFotoUrl = useCallback((url: string) => {
    return new Promise<void>((resolve, reject) => {
      const img = new window.Image()
      img.onload = () => resolve()
      img.onerror = () => reject(new Error("Gambar dari URL tidak dapat dimuat"))
      img.src = url
    })
  }, [])

  const applyFotoUrl = useCallback(
    async (rawValue: string) => {
      const value = rawValue.trim()
      setFotoUrlInput(value)

      if (!value) {
        // Input dikosongkan — hapus preview & payload jika sebelumnya dari URL
        if (/^https?:\/\//i.test(fotoPreview)) {
          setFotoPreview("")
          update("foto_kepala_dusun", "")
        }
        setFotoUrlError("")
        return
      }

      // Validasi format URL
      const isHttp = (() => {
        try {
          const u = new URL(value)
          return u.protocol === "http:" || u.protocol === "https:"
        } catch {
          return false
        }
      })()

      if (!isHttp) {
        setFotoUrlError("Gunakan URL lengkap yang diawali http:// atau https://")
        if (/^https?:\/\//i.test(fotoPreview)) {
          setFotoPreview("")
          update("foto_kepala_dusun", "")
        }
        return
      }

      setCheckingFotoUrl(true)
      try {
        await verifyFotoUrl(value)
        setFotoPreview(value)
        update("foto_kepala_dusun", value)
        setFotoUrlError("")
        showToast("success", "URL foto berhasil diverifikasi")
      } catch {
        setFotoUrlError("Gambar dari URL tidak dapat dimuat")
        if (/^https?:\/\//i.test(fotoPreview)) {
          setFotoPreview("")
          update("foto_kepala_dusun", "")
        }
      } finally {
        setCheckingFotoUrl(false)
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [fotoPreview, update, verifyFotoUrl]
  )

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setIsSaving(true)

    try {
      if (initialData?.id) {
        const result = await saveProfilDusunAction({
          id: initialData.id,
          payload: formData,
        })
        if (result.error) throw new Error(result.error)
        showToast("success", "Profil dusun berhasil diperbarui!")
      } else {
        const result = await saveProfilDusunAction({ payload: formData })
        if (result.error) throw new Error(result.error)
        showToast("success", "Profil dusun berhasil disimpan!")
      }
      router.refresh()
    } catch (err: unknown) {
      console.error(err)
      const msg =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error"
      showToast("error", `Gagal menyimpan: ${msg}`)
    } finally {
      setIsSaving(false)
    }
  }

  return (
    <div className="relative">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-5 right-5 z-50 flex items-center gap-3 px-5 py-3 rounded-xl shadow-2xl border text-sm font-medium transition-all ${
            toast.type === "success"
              ? "bg-green-900/90 border-green-500/40 text-green-200"
              : "bg-red-900/90 border-red-500/40 text-red-200"
          }`}
        >
          {toast.type === "success" ? (
            <CheckCircle2Icon className="size-4 shrink-0" />
          ) : (
            <AlertCircleIcon className="size-4 shrink-0" />
          )}
          {toast.message}
        </div>
      )}

      <form onSubmit={handleSave}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left/Main Form ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Identitas Wilayah */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <MapPinIcon className="size-3.5 text-blue-400" />
                Identitas Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="nama_dusun" className="text-xs text-slate-400 mb-1.5 block">
                    Nama Dusun <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama_dusun"
                    type="text"
                    value={formData.nama_dusun || ""}
                    onChange={(e) => update("nama_dusun", e.target.value)}
                    placeholder="Nama dusun..."
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="nama_desa" className="text-xs text-slate-400 mb-1.5 block">
                    Nama Desa <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama_desa"
                    type="text"
                    value={formData.nama_desa || ""}
                    onChange={(e) => update("nama_desa", e.target.value)}
                    placeholder="Nama desa..."
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="nama_kecamatan" className="text-xs text-slate-400 mb-1.5 block">
                    Kecamatan <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama_kecamatan"
                    type="text"
                    value={formData.nama_kecamatan || ""}
                    onChange={(e) => update("nama_kecamatan", e.target.value)}
                    placeholder="Nama kecamatan..."
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="nama_kabupaten" className="text-xs text-slate-400 mb-1.5 block">
                    Kabupaten <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama_kabupaten"
                    type="text"
                    value={formData.nama_kabupaten || ""}
                    onChange={(e) => update("nama_kabupaten", e.target.value)}
                    placeholder="Nama kabupaten..."
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="nama_provinsi" className="text-xs text-slate-400 mb-1.5 block">
                    Provinsi <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama_provinsi"
                    type="text"
                    value={formData.nama_provinsi || ""}
                    onChange={(e) => update("nama_provinsi", e.target.value)}
                    placeholder="Nama provinsi..."
                    required
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="kode_pos" className="text-xs text-slate-400 mb-1.5 block">
                    Kode Pos <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>
                  <input
                    id="kode_pos"
                    type="text"
                    value={formData.kode_pos || ""}
                    onChange={(e) => update("kode_pos", e.target.value)}
                    placeholder="Kode pos..."
                    className={inputCls}
                  />
                </div>
              </div>
            </div>

            {/* Kepemimpinan */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <UserIcon className="size-3.5 text-green-400" />
                Kepemimpinan
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="nama_kepala_dusun" className="text-xs text-slate-400 mb-1.5 block">
                    Nama Kepala Dusun <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="nama_kepala_dusun"
                    type="text"
                    value={formData.nama_kepala_dusun || ""}
                    onChange={(e) => update("nama_kepala_dusun", e.target.value)}
                    placeholder="Nama kepala dusun..."
                    required
                    className={inputCls}
                  />
                </div>

                {/* ── Foto Kepala Dusun — Image Uploader ── */}
                <div className="sm:col-span-2">
                  <label className="text-xs text-slate-400 mb-3 flex items-center gap-2">
                    <ImageIcon className="size-3.5 text-green-400" />
                    Foto Kepala Dusun{" "}
                    <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>

                  {fotoPreview ? (
                    /* ── Preview: foto sudah ada ── */
                    <div className="relative group w-fit">
                      <img
                        src={fotoPreview}
                        alt="Preview Foto Kepala Dusun"
                        className="h-32 w-32 object-cover rounded-2xl border border-slate-600/50 shadow-lg"
                      />
                      {/* Overlay spinner saat upload */}
                      {uploadingFoto && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/70 rounded-2xl">
                          <Loader2Icon className="size-7 animate-spin text-blue-400" />
                        </div>
                      )}
                      {/* Tombol hapus + ganti */}
                      {!uploadingFoto && (
                        <div className="absolute inset-0 flex flex-col items-center justify-center gap-1.5 bg-slate-900/60 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => fotoInputRef.current?.click()}
                            className="px-2.5 py-1 bg-blue-600/90 hover:bg-blue-600 text-white text-[10px] font-semibold rounded-lg flex items-center gap-1"
                          >
                            <UploadCloudIcon className="size-3" /> Ganti
                          </button>
                          <button
                            type="button"
                            onClick={removeFoto}
                            className="px-2.5 py-1 bg-red-600/90 hover:bg-red-600 text-white text-[10px] font-semibold rounded-lg flex items-center gap-1"
                          >
                            <XCircleIcon className="size-3" /> Hapus
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    /* ── Upload zone: belum ada foto ── */
                    <button
                      type="button"
                      onClick={() => fotoInputRef.current?.click()}
                      disabled={uploadingFoto}
                      className="w-full h-28 border-2 border-dashed border-slate-600/60 hover:border-green-500/50 rounded-xl flex flex-col items-center justify-center gap-2 text-slate-500 hover:text-green-400 transition-all group"
                    >
                      {uploadingFoto ? (
                        <Loader2Icon className="size-6 animate-spin" />
                      ) : (
                        <>
                          <UploadCloudIcon className="size-7 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-medium">Klik untuk unggah foto</span>
                          <span className="text-[10px]">JPG, PNG, WEBP — Maks 5MB</span>
                        </>
                      )}
                    </button>
                  )}

                  {/* Hidden file input */}
                  <input
                    ref={fotoInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleFotoChange}
                    className="hidden"
                  />

                  {/* Atau tempel URL langsung */}
                  <div className="mt-3">
                    <p className="text-[11px] text-slate-500 mb-1.5">Atau tempel URL foto langsung:</p>
                    <input
                      id="foto_kepala_dusun"
                      type="url"
                      value={fotoUrlInput}
                      onChange={(e) => {
                        const next = e.target.value
                        setFotoUrlInput(next)
                        setFotoUrlError("")
                        // Jika dikosongkan & preview sebelumnya dari URL, hapus
                        if (!next.trim() && /^https?:\/\//i.test(fotoPreview)) {
                          setFotoPreview("")
                          update("foto_kepala_dusun", "")
                        }
                      }}
                      onBlur={() => void applyFotoUrl(fotoUrlInput)}
                      placeholder="https://..."
                      className={`w-full bg-slate-900/50 border rounded-lg px-3 py-2 text-xs text-slate-300 placeholder:text-slate-500 focus:outline-none focus:ring-1 transition-all ${
                        fotoUrlError
                          ? "border-red-500/70 focus:ring-red-500/30"
                          : "border-slate-600/50 focus:ring-green-500/30"
                      }`}
                    />
                    <p className="mt-1.5 text-[10px] text-slate-500">
                      Hanya dipakai jika ingin memakai gambar online. Jika upload dari komputer, biarkan kosong.
                    </p>
                    {fotoUrlError && (
                      <p className="text-red-400 text-[11px] mt-1.5 flex items-center gap-1">
                        <AlertCircleIcon className="size-3" />
                        {fotoUrlError}
                      </p>
                    )}
                    {checkingFotoUrl && (
                      <p className="text-blue-400 text-[11px] mt-1.5 flex items-center gap-1">
                        <Loader2Icon className="size-3 animate-spin" />
                        Memeriksa URL gambar...
                      </p>
                    )}
                  </div>
                </div>
                {/* Pesan Sambutan */}
                <div className="sm:col-span-2">
                  <label htmlFor="pesan_sambutan" className="text-xs text-slate-400 mb-1.5 flex items-center gap-2">
                    <MessageSquareIcon className="size-3.5 text-green-400" />
                    Pesan Sambutan{" "}
                    <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>
                  <textarea
                    id="pesan_sambutan"
                    rows={4}
                    value={formData.pesan_sambutan || ""}
                    onChange={(e) => update("pesan_sambutan", e.target.value)}
                    placeholder="Tuliskan pesan sambutan dari kepala dusun..."
                    className={textareaCls}
                  />
                </div>

                {/* Sejarah Dusun */}
                <div className="sm:col-span-2">
                  <label htmlFor="sejarah_dusun" className="text-xs text-slate-400 mb-1.5 flex items-center gap-2">
                    <BookOpenIcon className="size-3.5 text-amber-400" />
                    Sejarah Dusun{" "}
                    <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>
                  <textarea
                    id="sejarah_dusun"
                    rows={5}
                    value={formData.sejarah_dusun || ""}
                    onChange={(e) => update("sejarah_dusun", e.target.value)}
                    placeholder="Ceritakan sejarah dan asal-usul dusun ini..."
                    className={textareaCls}
                  />
                </div>
              </div>
            </div>



            {/* Kontak */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <PhoneIcon className="size-3.5 text-orange-400" />
                Kontak &amp; Alamat
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label htmlFor="alamat_kantor" className="text-xs text-slate-400 mb-1.5 block">
                    Alamat Kantor <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>
                  <textarea
                    id="alamat_kantor"
                    rows={2}
                    value={formData.alamat_kantor || ""}
                    onChange={(e) => update("alamat_kantor", e.target.value)}
                    placeholder="Alamat kantor dusun..."
                    className={textareaCls}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="text-xs text-slate-400 mb-1.5 block">
                    Email Resmi <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>
                  <input
                    id="email"
                    type="email"
                    value={formData.email || ""}
                    onChange={(e) => update("email", e.target.value)}
                    placeholder="email@contoh.com"
                    className={inputCls}
                  />
                </div>
                <div>
                  <label htmlFor="no_telepon" className="text-xs text-slate-400 mb-1.5 block">
                    Nomor Telepon / WA <span className="text-slate-600 text-[10px]">(opsional)</span>
                  </label>
                  <input
                    id="no_telepon"
                    type="text"
                    value={formData.no_telepon || ""}
                    onChange={(e) => update("no_telepon", e.target.value)}
                    placeholder="08xxxxxxxxxx"
                    className={inputCls}
                  />
                </div>
              </div>
            </div>


          </div>

          {/* ── Right: Actions + Preview ── */}
          <div className="space-y-5">
            {/* Actions */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Aksi</h3>
              <button
                type="submit"
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                {isSaving ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SaveIcon className="size-4" />
                    {initialData ? "Simpan Perubahan" : "Buat Profil Dusun"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={isSaving}
                className="w-full flex items-center justify-center gap-2 bg-slate-700/50 hover:bg-slate-700 border border-slate-600/50 text-slate-300 font-medium py-2.5 rounded-xl transition-all text-sm"
              >
                <RefreshCwIcon className="size-4" />
                Reset ke Data Awal
              </button>
              <p className="text-[11px] text-slate-500 text-center pt-1 border-t border-slate-700/50">
                {initialData
                  ? "Perubahan langsung tersimpan ke database."
                  : "Data baru akan dibuat di database."}
              </p>
            </div>

            {/* Pratinjau Identitas */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <EyeIcon className="size-3.5" />
                Pratinjau Identitas
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Dusun", val: formData.nama_dusun },
                  { label: "Desa", val: formData.nama_desa },
                  { label: "Kecamatan", val: formData.nama_kecamatan },
                  { label: "Kabupaten", val: formData.nama_kabupaten },
                  { label: "Provinsi", val: formData.nama_provinsi },
                  { label: "Kepala Dusun", val: formData.nama_kepala_dusun },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-start text-xs gap-2">
                    <span className="text-slate-400 shrink-0">{item.label}</span>
                    <span className="font-semibold text-slate-200 text-right">
                      {item.val || <span className="text-slate-600 italic font-normal">Belum diisi</span>}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pratinjau Aset */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4 flex items-center gap-2">
                <ImageIcon className="size-3.5" />
                Pratinjau Aset
              </h3>
              <div className="space-y-3">

                {fotoPreview ? (
                  <div>
                    <p className="text-[10px] text-slate-500 mb-1.5">Foto Kepala Dusun</p>
                    <div className="relative w-fit">
                      <img
                        src={fotoPreview}
                        alt="Foto Kepala Dusun"
                        className="h-20 w-20 object-cover rounded-xl bg-slate-900/60 border border-slate-700/50"
                        onError={(e) => {
                          ;(e.target as HTMLImageElement).style.display = "none"
                        }}
                      />
                      {uploadingFoto && (
                        <div className="absolute inset-0 flex items-center justify-center bg-slate-900/60 rounded-xl">
                          <Loader2Icon className="size-4 animate-spin text-blue-400" />
                        </div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 p-3 rounded-xl border border-dashed border-slate-700/60 text-slate-600">
                    <ImageIcon className="size-4 shrink-0" />
                    <p className="text-[11px] italic">Belum ada foto kepala dusun.</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

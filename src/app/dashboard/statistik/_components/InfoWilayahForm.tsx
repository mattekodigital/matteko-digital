"use client"

import React, { useState, useCallback } from "react"
import {
  MapIcon,
  UsersIcon,
  HomeIcon,
  Building2Icon,
  SaveIcon,
  Loader2Icon,
  CheckCircle2Icon,
  AlertCircleIcon,
  RefreshCwIcon,
} from "lucide-react"
import { saveInfoWilayahAction } from "../_actions"
import type { InfoWilayah } from "@/lib/types"

interface Props {
  initialData: InfoWilayah | null
}

interface FormState {
  luas_wilayah: string
  total_penduduk: string
  total_kk: string
  kepadatan: string
  batas_utara: string
  batas_selatan: string
  batas_timur: string
  batas_barat: string
}

function toFormState(d: InfoWilayah | null): FormState {
  return {
    luas_wilayah: d ? String(d.luas_wilayah) : "",
    total_penduduk: d ? String(d.total_penduduk) : "",
    total_kk: d ? String(d.total_kk) : "",
    kepadatan: d ? String(d.kepadatan) : "",
    batas_utara: d?.batas_utara ?? "",
    batas_selatan: d?.batas_selatan ?? "",
    batas_timur: d?.batas_timur ?? "",
    batas_barat: d?.batas_barat ?? "",
  }
}

export default function InfoWilayahForm({ initialData }: Props) {
  const [form, setForm] = useState<FormState>(toFormState(initialData))
  const [submitting, setSubmitting] = useState(false)
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [errors, setErrors] = useState<Partial<Record<keyof FormState, string>>>({})

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  const update = useCallback(<K extends keyof FormState>(key: K, value: string) => {
    setForm((prev) => ({ ...prev, [key]: value }))
    setErrors((prev) => ({ ...prev, [key]: undefined }))
  }, [])

  const validate = (): boolean => {
    const e: Partial<Record<keyof FormState, string>> = {}
    if (!form.luas_wilayah || isNaN(Number(form.luas_wilayah)))
      e.luas_wilayah = "Masukkan angka yang valid"
    if (!form.total_penduduk || isNaN(Number(form.total_penduduk)))
      e.total_penduduk = "Masukkan angka yang valid"
    if (!form.total_kk || isNaN(Number(form.total_kk)))
      e.total_kk = "Masukkan angka yang valid"
    if (!form.kepadatan || isNaN(Number(form.kepadatan)))
      e.kepadatan = "Masukkan angka yang valid"
    setErrors(e)
    return Object.keys(e).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validate()) return
    setSubmitting(true)

    const payload = {
      luas_wilayah: parseFloat(form.luas_wilayah),
      total_penduduk: parseInt(form.total_penduduk),
      total_kk: parseInt(form.total_kk),
      kepadatan: parseInt(form.kepadatan),
      batas_utara: form.batas_utara.trim() || null,
      batas_selatan: form.batas_selatan.trim() || null,
      batas_timur: form.batas_timur.trim() || null,
      batas_barat: form.batas_barat.trim() || null,
      updated_at: new Date().toISOString(),
    }

    try {
      if (initialData) {
        const result = await saveInfoWilayahAction({
          id: initialData.id,
          payload,
        })
        if (result.error) throw new Error(result.error)
        showToast("success", "Data wilayah berhasil diperbarui!")
      } else {
        const result = await saveInfoWilayahAction({ payload })
        if (result.error) throw new Error(result.error)
        showToast("success", "Data wilayah berhasil disimpan!")
      }
    } catch (err: unknown) {
      console.error("Error saving wilayah data:", err)
      const msg =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error"
      showToast("error", `Gagal menyimpan: ${msg}`)
    } finally {
      setSubmitting(false)
    }
  }

  const handleReset = () => {
    setForm(toFormState(initialData))
    setErrors({})
  }

  // ── Field config ──────────────────────────────────────────────────────────────
  const numericFields: {
    key: keyof FormState
    label: string
    unit: string
    icon: React.ReactNode
    step?: string
  }[] = [
    {
      key: "luas_wilayah",
      label: "Luas Wilayah",
      unit: "km²",
      icon: <MapIcon className="size-4 text-blue-400" />,
      step: "0.01",
    },
    {
      key: "total_penduduk",
      label: "Total Penduduk",
      unit: "Jiwa",
      icon: <UsersIcon className="size-4 text-green-400" />,
    },
    {
      key: "total_kk",
      label: "Kepala Keluarga",
      unit: "KK",
      icon: <HomeIcon className="size-4 text-orange-400" />,
    },
    {
      key: "kepadatan",
      label: "Kepadatan Penduduk",
      unit: "Jiwa/km²",
      icon: <Building2Icon className="size-4 text-purple-400" />,
    },
  ]

  const borderFields: { key: keyof FormState; label: string; abbr: string }[] = [
    { key: "batas_utara", label: "Sebelah Utara", abbr: "U" },
    { key: "batas_selatan", label: "Sebelah Selatan", abbr: "S" },
    { key: "batas_timur", label: "Sebelah Timur", abbr: "T" },
    { key: "batas_barat", label: "Sebelah Barat", abbr: "B" },
  ]

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

      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* ── Left/Main Form ── */}
          <div className="lg:col-span-2 space-y-5">

            {/* Numeric Data */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Data Numerik Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {numericFields.map((f) => (
                  <div key={f.key}>
                    <label
                      htmlFor={f.key}
                      className="flex items-center gap-2 text-xs text-slate-400 mb-1.5"
                    >
                      {f.icon}
                      {f.label}{" "}
                      <span className="text-slate-600 text-[10px]">({f.unit})</span>
                      <span className="text-red-400 ml-auto">*</span>
                    </label>
                    <div className="relative">
                      <input
                        id={f.key}
                        type="number"
                        step={f.step ?? "1"}
                        min="0"
                        value={form[f.key]}
                        onChange={(e) => update(f.key, e.target.value)}
                        placeholder="0"
                        className={`w-full bg-slate-900/50 border rounded-xl px-4 py-2.5 pr-14 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 transition-all ${
                          errors[f.key]
                            ? "border-red-500/70 focus:ring-red-500/30"
                            : "border-slate-600/50 focus:ring-blue-500/30 focus:border-blue-500/50"
                        }`}
                      />
                      <span className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-slate-500 font-medium">
                        {f.unit}
                      </span>
                    </div>
                    {errors[f.key] && (
                      <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                        <AlertCircleIcon className="size-3" />
                        {errors[f.key]}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Batas Wilayah */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Batas Wilayah
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {borderFields.map((f) => (
                  <div key={f.key}>
                    <label
                      htmlFor={f.key}
                      className="flex items-center gap-2 text-xs text-slate-400 mb-1.5"
                    >
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-300 flex items-center justify-center text-[10px] font-bold shrink-0">
                        {f.abbr}
                      </span>
                      {f.label}
                      <span className="text-slate-600 text-[10px] ml-auto">(opsional)</span>
                    </label>
                    <input
                      id={f.key}
                      type="text"
                      value={form[f.key]}
                      onChange={(e) => update(f.key, e.target.value)}
                      placeholder={`Nama batas ${f.label.split(" ")[1].toLowerCase()}...`}
                      className="w-full bg-slate-900/50 border border-slate-600/50 rounded-xl px-4 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 focus:border-blue-500/50 transition-all"
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* ── Right: Actions + Preview ── */}
          <div className="space-y-5">
            {/* Actions */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5 space-y-3">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
                Aksi
              </h3>
              <button
                type="submit"
                disabled={submitting}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-600/50 disabled:cursor-not-allowed text-white font-semibold py-2.5 rounded-xl transition-all text-sm"
              >
                {submitting ? (
                  <>
                    <Loader2Icon className="size-4 animate-spin" />
                    Menyimpan...
                  </>
                ) : (
                  <>
                    <SaveIcon className="size-4" />
                    {initialData ? "Simpan Perubahan" : "Buat Data Wilayah"}
                  </>
                )}
              </button>
              <button
                type="button"
                onClick={handleReset}
                disabled={submitting}
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

            {/* Live Preview */}
            <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-5">
              <h3 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-4">
                Pratinjau Data
              </h3>
              <div className="space-y-3">
                {[
                  { label: "Luas Wilayah", val: form.luas_wilayah ? `${form.luas_wilayah} km²` : "-" },
                  { label: "Total Penduduk", val: form.total_penduduk ? `${Number(form.total_penduduk).toLocaleString("id-ID")} Jiwa` : "-" },
                  { label: "Kepala Keluarga", val: form.total_kk ? `${Number(form.total_kk).toLocaleString("id-ID")} KK` : "-" },
                  { label: "Kepadatan", val: form.kepadatan ? `${Number(form.kepadatan).toLocaleString("id-ID")} Jiwa/km²` : "-" },
                ].map((item) => (
                  <div key={item.label} className="flex justify-between items-center text-xs">
                    <span className="text-slate-400">{item.label}</span>
                    <span className="font-semibold text-slate-200">{item.val}</span>
                  </div>
                ))}
                <div className="border-t border-slate-700/50 pt-3 mt-3 space-y-2">
                  {[
                    { abbr: "U", val: form.batas_utara },
                    { abbr: "S", val: form.batas_selatan },
                    { abbr: "T", val: form.batas_timur },
                    { abbr: "B", val: form.batas_barat },
                  ].map((b) => (
                    <div key={b.abbr} className="flex items-center gap-2 text-xs">
                      <span className="w-5 h-5 rounded-full bg-slate-700 text-slate-400 flex items-center justify-center text-[9px] font-bold shrink-0">
                        {b.abbr}
                      </span>
                      <span className="text-slate-300">{b.val || <span className="text-slate-600 italic">Belum diisi</span>}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </form>
    </div>
  )
}

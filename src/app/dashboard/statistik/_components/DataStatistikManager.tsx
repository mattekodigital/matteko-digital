"use client"

import React, { useState, useCallback } from "react"
import {
  PlusIcon,
  Trash2Icon,
  SaveIcon,
  Loader2Icon,
  CheckCircle2Icon,
  AlertCircleIcon,
  GripVerticalIcon,
  BriefcaseIcon,
  FlameIcon,
  Users2Icon,
  GraduationCapIcon,
} from "lucide-react"
import {
  deleteDataStatistikAction,
  saveDataStatistikAction,
} from "../_actions"
import type { DataStatistik } from "@/lib/types"

type Kategori = DataStatistik["kategori"]

const KATEGORI_CONFIG: {
  id: Kategori
  label: string
  icon: React.ReactNode
  color: string
  accent: string
  placeholder: string
}[] = [
  {
    id: "pekerjaan",
    label: "Mata Pencaharian",
    icon: <BriefcaseIcon className="size-4" />,
    color: "bg-yellow-500/10 border-yellow-500/20 text-yellow-300",
    accent: "bg-yellow-500",
    placeholder: "cth: Petani, Pedagang, PNS...",
  },
  {
    id: "agama",
    label: "Agama Penduduk",
    icon: <FlameIcon className="size-4" />,
    color: "bg-purple-500/10 border-purple-500/20 text-purple-300",
    accent: "bg-purple-500",
    placeholder: "cth: Islam, Kristen, Katolik...",
  },
  {
    id: "gender",
    label: "Demografi Gender",
    icon: <Users2Icon className="size-4" />,
    color: "bg-pink-500/10 border-pink-500/20 text-pink-300",
    accent: "bg-pink-500",
    placeholder: "cth: Laki-laki, Perempuan",
  },
  {
    id: "pendidikan",
    label: "Tingkat Pendidikan",
    icon: <GraduationCapIcon className="size-4" />,
    color: "bg-blue-500/10 border-blue-500/20 text-blue-300",
    accent: "bg-blue-500",
    placeholder: "cth: SD/Sederajat, SMA/Sederajat...",
  },
]

// Draft rows being edited in-memory
interface DraftRow {
  id?: number
  label: string
  nilai: string
  urutan: number
  isDirty?: boolean
  isNew?: boolean
}

function toDraftRows(items: DataStatistik[]): DraftRow[] {
  return items.map((d) => ({
    id: d.id,
    label: d.label,
    nilai: String(d.nilai),
    urutan: d.urutan,
  }))
}

interface Props {
  initialData: DataStatistik[]
}

export default function DataStatistikManager({ initialData }: Props) {
  const [drafts, setDrafts] = useState<Record<Kategori, DraftRow[]>>({
    pekerjaan: toDraftRows(initialData.filter((d) => d.kategori === "pekerjaan")),
    agama: toDraftRows(initialData.filter((d) => d.kategori === "agama")),
    gender: toDraftRows(initialData.filter((d) => d.kategori === "gender")),
    pendidikan: toDraftRows(initialData.filter((d) => d.kategori === "pendidikan")),
  })

  const [saving, setSaving] = useState<Partial<Record<Kategori, boolean>>>({})
  const [toast, setToast] = useState<{ type: "success" | "error"; message: string } | null>(null)
  const [activeKat, setActiveKat] = useState<Kategori>("pekerjaan")

  const showToast = (type: "success" | "error", message: string) => {
    setToast({ type, message })
    setTimeout(() => setToast(null), 4000)
  }

  // ── Update a field in a draft row ────────────────────────────────────────────
  const updateRow = useCallback(
    (kat: Kategori, idx: number, field: "label" | "nilai", value: string) => {
      setDrafts((prev) => {
        const rows = [...prev[kat]]
        rows[idx] = { ...rows[idx], [field]: value, isDirty: true }
        return { ...prev, [kat]: rows }
      })
    },
    []
  )

  // ── Add a new blank row ──────────────────────────────────────────────────────
  const addRow = useCallback((kat: Kategori) => {
    setDrafts((prev) => {
      const rows = prev[kat]
      const maxUrutan = rows.reduce((m, r) => Math.max(m, r.urutan), 0)
      return {
        ...prev,
        [kat]: [
          ...rows,
          { label: "", nilai: "0", urutan: maxUrutan + 1, isNew: true, isDirty: true },
        ],
      }
    })
  }, [])

  // ── Remove a row (delete from DB if it has an id) ───────────────────────────
  const removeRow = useCallback(
    async (kat: Kategori, idx: number) => {
      const row = drafts[kat][idx]
      if (row.id) {
        const result = await deleteDataStatistikAction(row.id)
        if (result.error) {
          showToast("error", result.error)
          return
        }
      }
      setDrafts((prev) => {
        const rows = [...prev[kat]]
        rows.splice(idx, 1)
        return { ...prev, [kat]: rows }
      })
      showToast("success", "Baris berhasil dihapus")
    },
    [drafts]
  )

  // ── Save all rows for a category ────────────────────────────────────────────
  const saveKategori = async (kat: Kategori) => {
    setSaving((prev) => ({ ...prev, [kat]: true }))
    const rows = drafts[kat]

    try {
      for (let i = 0; i < rows.length; i++) {
        const row = rows[i]
        if (!row.isDirty) continue

        const payload = {
          kategori: kat,
          label: row.label.trim(),
          nilai: parseInt(row.nilai) || 0,
          urutan: row.urutan,
        }

        if (!payload.label) {
          showToast("error", `Baris ${i + 1}: Label tidak boleh kosong`)
          setSaving((prev) => ({ ...prev, [kat]: false }))
          return
        }

        if (row.id) {
          const result = await saveDataStatistikAction({ id: row.id, ...payload })
          if (result.error) throw new Error(result.error)
        } else {
          const result = await saveDataStatistikAction(payload)
          if (result.error) throw new Error(result.error)
          // Persist the new id so future saves update correctly
          setDrafts((prev) => {
            const updated = [...prev[kat]]
            updated[i] = { ...updated[i], id: result.id, isNew: false, isDirty: false }
            return { ...prev, [kat]: updated }
          })
        }
      }

      // Mark all as clean
      setDrafts((prev) => ({
        ...prev,
        [kat]: prev[kat].map((r) => ({ ...r, isDirty: false, isNew: false })),
      }))

      showToast("success", `Data "${KATEGORI_CONFIG.find((k) => k.id === kat)?.label}" berhasil disimpan!`)
    } catch (err: unknown) {
      console.error("Error saving statistik data:", err)
      const msg =
        err instanceof Error ? err.message : typeof err === "string" ? err : "Unknown error"
      showToast("error", `Gagal menyimpan: ${msg}`)
    } finally {
      setSaving((prev) => ({ ...prev, [kat]: false }))
    }
  }

  // ── Render ────────────────────────────────────────────────────────────────────
  const cfg = KATEGORI_CONFIG.find((k) => k.id === activeKat)!
  const rows = drafts[activeKat]
  const isDirtyCurrent = rows.some((r) => r.isDirty)
  const totalCurrent = rows.reduce((s, r) => s + (parseInt(r.nilai) || 0), 0)

  return (
    <div className="relative space-y-5">
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

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* ── Left: Category Switcher ── */}
        <div className="lg:col-span-1">
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 p-3 space-y-1.5">
            <p className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider px-2 pb-1">
              Kategori
            </p>
            {KATEGORI_CONFIG.map((k) => {
              const count = drafts[k.id].length
              const dirty = drafts[k.id].some((r) => r.isDirty)
              return (
                <button
                  key={k.id}
                  onClick={() => setActiveKat(k.id)}
                  className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                    activeKat === k.id
                      ? `${k.color} border`
                      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700/40"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    {k.icon}
                    <span className="truncate">{k.label}</span>
                  </div>
                  <div className="flex items-center gap-1.5 shrink-0">
                    {dirty && (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400" title="Ada perubahan belum disimpan" />
                    )}
                    <span className="text-[10px] bg-slate-700/60 rounded-full px-2 py-0.5">
                      {count}
                    </span>
                  </div>
                </button>
              )
            })}
          </div>
        </div>

        {/* ── Right: Row Editor ── */}
        <div className="lg:col-span-3 space-y-4">
          {/* Category Header */}
          <div className={`flex items-center justify-between bg-slate-800/40 rounded-2xl border ${cfg.color.split(" ").find((c) => c.startsWith("border"))!} p-4`}>
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${cfg.color}`}>
                {cfg.icon}
              </div>
              <div>
                <h3 className="font-bold text-slate-200">{cfg.label}</h3>
                <p className="text-xs text-slate-500">
                  {rows.length} item · Total: {totalCurrent.toLocaleString("id-ID")}
                  {isDirtyCurrent && (
                    <span className="ml-2 text-amber-400">· Ada perubahan</span>
                  )}
                </p>
              </div>
            </div>
            <button
              onClick={() => saveKategori(activeKat)}
              disabled={saving[activeKat] || !isDirtyCurrent}
              className="flex items-center gap-2 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:text-slate-500 disabled:cursor-not-allowed text-white font-semibold px-4 py-2 rounded-xl text-sm transition-all"
            >
              {saving[activeKat] ? (
                <>
                  <Loader2Icon className="size-4 animate-spin" />
                  Menyimpan...
                </>
              ) : (
                <>
                  <SaveIcon className="size-4" />
                  Simpan
                </>
              )}
            </button>
          </div>

          {/* Rows */}
          <div className="bg-slate-800/40 rounded-2xl border border-slate-700/50 overflow-hidden">
            {/* Table Header */}
            <div className="grid grid-cols-12 gap-3 px-4 py-2.5 bg-slate-800/60 border-b border-slate-700/50 text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
              <div className="col-span-1" />
              <div className="col-span-5">Label</div>
              <div className="col-span-3">Jumlah (Orang)</div>
              <div className="col-span-2">Urutan</div>
              <div className="col-span-1" />
            </div>

            {/* Rows */}
            <div className="divide-y divide-slate-700/30">
              {rows.length === 0 ? (
                <div className="py-12 text-center text-slate-500">
                  <p className="text-sm">Belum ada data untuk kategori ini.</p>
                  <p className="text-xs mt-1">Klik &quot;+ Tambah Baris&quot; untuk memulai.</p>
                </div>
              ) : (
                rows.map((row, idx) => (
                  <div
                    key={idx}
                    className={`grid grid-cols-12 gap-3 px-4 py-3 items-center group transition-colors ${
                      row.isDirty
                        ? "bg-amber-500/5 border-l-2 border-amber-500/40"
                        : "hover:bg-slate-700/20"
                    }`}
                  >
                    {/* Grip */}
                    <div className="col-span-1 flex justify-center">
                      <GripVerticalIcon className="size-4 text-slate-600 group-hover:text-slate-400" />
                    </div>

                    {/* Label */}
                    <div className="col-span-5">
                      <input
                        type="text"
                        value={row.label}
                        onChange={(e) => updateRow(activeKat, idx, "label", e.target.value)}
                        placeholder={cfg.placeholder}
                        className="w-full bg-slate-900/50 border border-slate-600/40 rounded-lg px-3 py-1.5 text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Nilai */}
                    <div className="col-span-3">
                      <input
                        type="number"
                        min="0"
                        value={row.nilai}
                        onChange={(e) => updateRow(activeKat, idx, "nilai", e.target.value)}
                        className="w-full bg-slate-900/50 border border-slate-600/40 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Urutan */}
                    <div className="col-span-2">
                      <input
                        type="number"
                        min="0"
                        value={row.urutan}
                        onChange={(e) =>
                          setDrafts((prev) => {
                            const updated = [...prev[activeKat]]
                            updated[idx] = {
                              ...updated[idx],
                              urutan: parseInt(e.target.value) || 0,
                              isDirty: true,
                            }
                            return { ...prev, [activeKat]: updated }
                          })
                        }
                        className="w-full bg-slate-900/50 border border-slate-600/40 rounded-lg px-3 py-1.5 text-sm text-slate-100 focus:outline-none focus:ring-1 focus:ring-blue-500/40 transition-all"
                      />
                    </div>

                    {/* Delete */}
                    <div className="col-span-1 flex justify-center">
                      <button
                        onClick={() => removeRow(activeKat, idx)}
                        className="p-1.5 rounded-lg text-slate-600 hover:text-red-400 hover:bg-red-500/10 opacity-0 group-hover:opacity-100 transition-all"
                        title="Hapus baris"
                      >
                        <Trash2Icon className="size-4" />
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Add Row Footer */}
            <div className="px-4 py-3 border-t border-slate-700/30 flex items-center justify-between">
              <button
                onClick={() => addRow(activeKat)}
                className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                <PlusIcon className="size-4" />
                Tambah Baris Baru
              </button>
              {rows.length > 0 && (
                <p className="text-xs text-slate-500">
                  Total:{" "}
                  <span className="font-semibold text-slate-300">
                    {totalCurrent.toLocaleString("id-ID")} orang
                  </span>
                </p>
              )}
            </div>
          </div>

          {/* Save hint */}
          {isDirtyCurrent && (
            <p className="text-xs text-amber-400/80 flex items-center gap-1.5">
              <AlertCircleIcon className="size-3.5" />
              Ada perubahan yang belum disimpan. Klik &quot;Simpan&quot; untuk menyimpan ke database.
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

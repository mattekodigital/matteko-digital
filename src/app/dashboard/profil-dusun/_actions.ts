"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import type { ProfilDusun } from "@/lib/types"

type ProfilInput = Partial<Omit<ProfilDusun, "created_at" | "updated_at">>

const PROFIL_FIELDS = [
  "nama_dusun",
  "nama_desa",
  "nama_kecamatan",
  "nama_kabupaten",
  "nama_provinsi",
  "kode_pos",
  "nama_kepala_dusun",
  "foto_kepala_dusun",
  "pesan_sambutan",
  "sejarah_dusun",
  "visi",
  "misi",
  "email",
  "no_telepon",
  "alamat_kantor",
  "link_facebook",
  "link_instagram",
  "link_youtube",
  "url_logo",
  "url_banner",
] as const

export async function saveProfilDusunAction(input: {
  id?: string
  payload: ProfilInput
}): Promise<{ error?: string }> {
  const values = PROFIL_FIELDS.map((field) => {
    const value = input.payload[field]
    return typeof value === "string" && value.trim() === "" ? null : value ?? null
  })

  if (!input.payload.nama_dusun || !input.payload.nama_kepala_dusun) {
    return { error: "Nama dusun dan nama kepala dusun wajib diisi" }
  }

  try {
    if (input.id) {
      const assignments = PROFIL_FIELDS.map(
        (field, index) => `${field} = $${index + 1}`
      ).join(", ")
      await query(
        `UPDATE profil_dusun
         SET ${assignments}, updated_at = NOW()
         WHERE id = $${PROFIL_FIELDS.length + 1}`,
        [...values, input.id]
      )
    } else {
      await query(
        `INSERT INTO profil_dusun (${PROFIL_FIELDS.join(", ")})
         VALUES (${PROFIL_FIELDS.map((_, index) => `$${index + 1}`).join(", ")})`,
        values
      )
    }

    revalidatePath("/")
    revalidatePath("/profil")
    revalidatePath("/dashboard/profil-dusun")
    return {}
  } catch (error) {
    console.error("[saveProfilDusunAction]", error)
    return { error: "Gagal menyimpan profil dusun" }
  }
}

"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import type { DataStatistik, InfoWilayah } from "@/lib/types"

type WilayahInput = Omit<InfoWilayah, "id" | "updated_at">

export async function saveInfoWilayahAction(input: {
  id?: number
  payload: WilayahInput
}): Promise<{ error?: string }> {
  try {
    if (input.id) {
      await query(
        `UPDATE info_wilayah
         SET luas_wilayah = $1,
             total_penduduk = $2,
             total_kk = $3,
             kepadatan = $4,
             batas_utara = $5,
             batas_selatan = $6,
             batas_timur = $7,
             batas_barat = $8,
             updated_at = NOW()
         WHERE id = $9`,
        [
          input.payload.luas_wilayah,
          input.payload.total_penduduk,
          input.payload.total_kk,
          input.payload.kepadatan,
          input.payload.batas_utara,
          input.payload.batas_selatan,
          input.payload.batas_timur,
          input.payload.batas_barat,
          input.id,
        ]
      )
    } else {
      await query(
        `INSERT INTO info_wilayah
          (luas_wilayah, total_penduduk, total_kk, kepadatan, batas_utara, batas_selatan, batas_timur, batas_barat)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          input.payload.luas_wilayah,
          input.payload.total_penduduk,
          input.payload.total_kk,
          input.payload.kepadatan,
          input.payload.batas_utara,
          input.payload.batas_selatan,
          input.payload.batas_timur,
          input.payload.batas_barat,
        ]
      )
    }

    revalidatePath("/statistik")
    revalidatePath("/dashboard/statistik")
    return {}
  } catch (error) {
    console.error("[saveInfoWilayahAction]", error)
    return { error: "Gagal menyimpan data wilayah" }
  }
}

export async function deleteDataStatistikAction(id: number): Promise<{ error?: string }> {
  try {
    await query("DELETE FROM data_statistik WHERE id = $1", [id])
    revalidatePath("/statistik")
    revalidatePath("/dashboard/statistik")
    return {}
  } catch (error) {
    console.error("[deleteDataStatistikAction]", error)
    return { error: "Gagal menghapus data statistik" }
  }
}

export async function saveDataStatistikAction(input: {
  id?: number
  kategori: DataStatistik["kategori"]
  label: string
  nilai: number
  urutan: number
}): Promise<{ id?: number; error?: string }> {
  if (!input.label.trim()) {
    return { error: "Label tidak boleh kosong" }
  }

  try {
    if (input.id) {
      await query(
        `UPDATE data_statistik
         SET kategori = $1, label = $2, nilai = $3, urutan = $4
         WHERE id = $5`,
        [input.kategori, input.label.trim(), input.nilai, input.urutan, input.id]
      )
      revalidatePath("/statistik")
      revalidatePath("/dashboard/statistik")
      return { id: input.id }
    }

    const { rows } = await query<{ id: number }>(
      `INSERT INTO data_statistik (kategori, label, nilai, urutan)
       VALUES ($1, $2, $3, $4)
       RETURNING id`,
      [input.kategori, input.label.trim(), input.nilai, input.urutan]
    )

    revalidatePath("/statistik")
    revalidatePath("/dashboard/statistik")
    return { id: rows[0]?.id }
  } catch (error) {
    console.error("[saveDataStatistikAction]", error)
    return { error: "Gagal menyimpan data statistik" }
  }
}

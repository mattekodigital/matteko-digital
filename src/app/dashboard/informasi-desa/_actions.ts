"use server"

import { revalidatePath } from "next/cache"
import { query } from "@/lib/db"
import type { InformasiDesa } from "@/lib/types"

type InformasiInput = Pick<
  InformasiDesa,
  "kategori" | "judul" | "konten" | "image_url" | "penulis" | "tanggal_kegiatan" | "lokasi"
>

export async function saveInformasiAction(input: {
  id?: string
  payload: InformasiInput
}): Promise<{ error?: string }> {
  const payload = {
    ...input.payload,
    judul: input.payload.judul.trim(),
    konten: input.payload.konten.trim(),
    penulis: input.payload.penulis?.trim() || "Administrator Dusun",
    image_url: input.payload.image_url || null,
    tanggal_kegiatan: input.payload.tanggal_kegiatan || null,
    lokasi: input.payload.lokasi?.trim() || null,
  }

  if (!payload.judul || !payload.konten || !payload.penulis) {
    return { error: "Judul, konten, dan penulis wajib diisi" }
  }

  try {
    if (input.id) {
      await query(
        `UPDATE informasi_dusun
         SET kategori = $1,
             judul = $2,
             konten = $3,
             image_url = $4,
             penulis = $5,
             tanggal_kegiatan = $6,
             lokasi = $7
         WHERE id = $8`,
        [
          payload.kategori,
          payload.judul,
          payload.konten,
          payload.image_url,
          payload.penulis,
          payload.tanggal_kegiatan,
          payload.lokasi,
          input.id,
        ]
      )
    } else {
      await query(
        `INSERT INTO informasi_dusun
          (kategori, judul, konten, image_url, penulis, tanggal_kegiatan, lokasi)
         VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          payload.kategori,
          payload.judul,
          payload.konten,
          payload.image_url,
          payload.penulis,
          payload.tanggal_kegiatan,
          payload.lokasi,
        ]
      )
    }

    revalidatePath("/")
    revalidatePath("/informasi")
    revalidatePath("/dashboard/informasi-desa")
    return {}
  } catch (error) {
    console.error("[saveInformasiAction]", error)
    return { error: "Gagal menyimpan data informasi" }
  }
}

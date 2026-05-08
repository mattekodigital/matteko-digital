import "server-only"

import { query } from "@/lib/db"
import type { InformasiDesa } from "@/lib/types"

type Kategori = InformasiDesa["kategori"]
type OrderColumn = "created_at" | "tanggal_kegiatan" | "judul"

const INFORMASI_COLUMNS =
  "id, kategori, judul, konten, image_url, penulis, tanggal_kegiatan, lokasi, created_at"

function orderClause(column: OrderColumn, ascending: boolean) {
  return `${column} ${ascending ? "ASC" : "DESC"} NULLS LAST`
}

export async function listInformasiByKategori(
  kategori: Kategori,
  options: { limit?: number; orderBy?: OrderColumn; ascending?: boolean } = {}
) {
  const params: unknown[] = [kategori]
  const limitClause = options.limit ? ` LIMIT $${params.push(options.limit)}` : ""
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     WHERE kategori = $1
     ORDER BY ${orderClause(options.orderBy ?? "created_at", options.ascending ?? false)}
     ${limitClause}`,
    params
  )

  return rows
}

export async function listInformasiByKategoriIn(
  kategori: Kategori[],
  options: { limit?: number; orderBy?: OrderColumn; ascending?: boolean } = {}
) {
  const params: unknown[] = [kategori]
  const limitClause = options.limit ? ` LIMIT $${params.push(options.limit)}` : ""
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     WHERE kategori = ANY($1)
     ORDER BY ${orderClause(options.orderBy ?? "created_at", options.ascending ?? false)}
     ${limitClause}`,
    params
  )

  return rows
}

export async function listAllInformasi() {
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     ORDER BY created_at DESC NULLS LAST`
  )

  return rows
}

export async function listLatestInformasi(limit: number) {
  const { rows } = await query<Pick<
    InformasiDesa,
    "id" | "judul" | "kategori" | "image_url" | "created_at" | "penulis"
  >>(
    `SELECT id, judul, kategori, image_url, created_at, penulis
     FROM informasi_dusun
     ORDER BY created_at DESC NULLS LAST
     LIMIT $1`,
    [limit]
  )

  return rows
}

export async function getInformasiById(id: string) {
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     WHERE id = $1
     LIMIT 1`,
    [id]
  )

  return rows[0] ?? null
}

export async function getInformasiByIdAndKategori(id: string, kategori: Kategori) {
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     WHERE id = $1 AND kategori = $2
     LIMIT 1`,
    [id, kategori]
  )

  return rows[0] ?? null
}

export async function getInformasiByIdAndKategoriIn(id: string, kategori: Kategori[]) {
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     WHERE id = $1 AND kategori = ANY($2)
     LIMIT 1`,
    [id, kategori]
  )

  return rows[0] ?? null
}

export async function listRelatedInformasi(
  kategori: Kategori,
  excludeId: string,
  options: { limit?: number; orderBy?: OrderColumn; ascending?: boolean } = {}
) {
  const { rows } = await query<InformasiDesa>(
    `SELECT ${INFORMASI_COLUMNS}
     FROM informasi_dusun
     WHERE kategori = $1 AND id <> $2
     ORDER BY ${orderClause(options.orderBy ?? "created_at", options.ascending ?? false)}
     LIMIT $3`,
    [kategori, excludeId, options.limit ?? 3]
  )

  return rows
}

export async function countInformasi(kategori?: Kategori) {
  const { rows } = await query<{ count: string }>(
    kategori
      ? "SELECT COUNT(*)::text AS count FROM informasi_dusun WHERE kategori = $1"
      : "SELECT COUNT(*)::text AS count FROM informasi_dusun",
    kategori ? [kategori] : undefined
  )

  return Number(rows[0]?.count ?? 0)
}

import "server-only"

import { query } from "@/lib/db"
import type { DataStatistik, InfoWilayah } from "@/lib/types"

export async function getLatestInfoWilayah() {
  const { rows } = await query<InfoWilayah>(
    `SELECT *
     FROM info_wilayah
     ORDER BY id DESC
     LIMIT 1`
  )

  return rows[0] ?? null
}

export async function getAllDataStatistik() {
  const { rows } = await query<DataStatistik>(
    `SELECT *
     FROM data_statistik
     ORDER BY urutan ASC`
  )

  return rows
}

// src/lib/data/profil.ts
// Menggunakan React cache() untuk dedup fetch profil_dusun di semua server components
// dalam 1 request. Layout.tsx dan page.tsx yang sama-sama fetch profil_dusun
// tidak akan double-hit database — Next.js akan memoize hasilnya.
import { cache } from 'react'
import { createClient } from '@/lib/supabase/server'
import type { ProfilDusun } from '@/lib/types'

export const getProfilDusun = cache(async (): Promise<ProfilDusun | null> => {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('profil_dusun')
    .select(
      'id, nama_dusun, nama_desa, nama_kecamatan, nama_kabupaten, nama_provinsi, kode_pos, ' +
      'nama_kepala_dusun, foto_kepala_dusun, pesan_sambutan, sejarah_dusun, visi, misi, ' +
      'email, no_telepon, alamat_kantor, link_facebook, link_instagram, link_youtube, ' +
      'url_logo, url_banner, created_at, updated_at'
    )
    .limit(1)
    .single()

  if (error) {
    // Not an error if row doesn't exist yet (PGRST116 = no rows)
    if (error.code !== 'PGRST116') {
      console.error('[getProfilDusun]', error.message)
    }
    return null
  }

  return (data as unknown as ProfilDusun) ?? null


})

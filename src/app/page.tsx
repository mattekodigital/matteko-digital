import type { Metadata } from "next";
import { createClient } from "@/lib/supabase/server";
import { getProfilDusun } from "@/lib/data/profil";
import type { InformasiDesa } from "@/lib/types";
import HomeClient from "./_components/HomeClient";

export const metadata: Metadata = {
  title: "Beranda",
  description:
    "Website resmi Dusun Matteko, Kabupaten Gowa - Selamat datang di portal informasi pemerintahan, berita, dan potensi .",
  openGraph: {
    title: "Beranda - Dusun Matteko Digital",
    description:
      "Website resmi Dusun Matteko, Kabupaten Gowa - Informasi pemerintahan, berita, dan potensi dusun.",
  },
};

export const revalidate = 300;

export default async function HomePage() {
  const supabase = await createClient();

  const [profil, beritaData, potensiData] = await Promise.all([
    getProfilDusun(),
    supabase
      .from("informasi_dusun")
      .select(
        "id, judul, konten, image_url, penulis, tanggal_kegiatan, created_at, kategori, lokasi"
      )
      .eq("kategori", "berita")
      .order("created_at", { ascending: false })
      .limit(3)
      .then((r) => r.data),
    supabase
      .from("informasi_dusun")
      .select(
        "id, judul, konten, image_url, kategori, lokasi, created_at, penulis, tanggal_kegiatan"
      )
      .in("kategori", ["wisata", "umkm", "pertanian"])
      .order("created_at", { ascending: false })
      .limit(3)
      .then((r) => r.data),
  ]);

  const beritaList: InformasiDesa[] = beritaData ?? [];
  const potensiList: InformasiDesa[] = potensiData ?? [];

  return (
    <HomeClient
      profil={profil}
      beritaList={beritaList}
      potensiList={potensiList}
    />
  );
}
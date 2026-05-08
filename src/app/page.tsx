import type { Metadata } from "next";
import { getProfilDusun } from "@/lib/data/profil";
import { listInformasiByKategori, listInformasiByKategoriIn } from "@/lib/data/informasi";
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

export const dynamic = "force-dynamic";

export default async function HomePage() {
  const [profil, beritaList, potensiList] = await Promise.all([
    getProfilDusun(),
    listInformasiByKategori("berita", { limit: 3 }),
    listInformasiByKategoriIn(["wisata", "umkm", "pertanian"], { limit: 3 }),
  ]);

  return (
    <HomeClient
      profil={profil}
      beritaList={beritaList}
      potensiList={potensiList}
    />
  );
}

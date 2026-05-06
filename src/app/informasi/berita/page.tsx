import type { Metadata } from "next";
import Image from "next/image";
import { Megaphone } from "lucide-react";
import { listInformasiByKategori } from "@/lib/data/informasi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import BeritaGrid from "./_components/BeritaGrid";

export const metadata: Metadata = {
  title: "Berita Dusun",
  description:
    "Kumpulan berita dan artikel terbaru seputar kegiatan, pembangunan, dan informasi Dusun Matteko.",
  openGraph: {
    title: "Berita Dusun Matteko",
    description:
      "Kumpulan berita dan artikel terbaru seputar kegiatan dan pembangunan Dusun Matteko.",
  },
};

export const dynamic = "force-dynamic";

export default async function BeritaPage() {
  const items = await listInformasiByKategori("berita");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/berita-kegiatan.webp"
          alt="Berita Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Megaphone className="w-3.5 h-3.5" />
            Berita Resmi
          </div>
          <h1 className="text-4xl font-bold mb-2">Berita Dusun</h1>
          <p className="text-lg text-gray-200">
            Kumpulan berita dan artikel terbaru seputar dusun.
          </p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-6 py-3 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbLink href="/informasi">Informasi Dusun</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Berita</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <BeritaGrid items={items} />
      </div>
    </div>
  );
}

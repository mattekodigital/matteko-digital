import type { Metadata } from "next";
import Image from "next/image";
import { Images } from "lucide-react";
import { listInformasiByKategori } from "@/lib/data/informasi";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import GaleriGrid from "./_components/GaleriGrid";

export const metadata: Metadata = {
  title: "Galeri Dusun",
  description:
    "Dokumentasi foto dan kegiatan Dusun Matteko dalam gambar.",
  openGraph: {
    title: "Galeri Dusun Matteko",
    description: "Dokumentasi foto dan kegiatan Dusun Matteko dalam gambar.",
  },
};

export const dynamic = "force-dynamic";

export default async function GaleriPage() {
  const items = await listInformasiByKategori("galeri");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/galeri-kegiatan.webp"
          alt="Galeri Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Images className="w-3.5 h-3.5" />
            Dokumentasi Visual
          </div>
          <h1 className="text-4xl font-bold mb-2 drop-shadow-md">Galeri Dusun</h1>
          <p className="text-gray-200 text-base max-w-md">
            Dokumentasi foto dan kegiatan Dusun Matteko dalam gambar.
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
              <BreadcrumbPage>Galeri</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Gallery Grid */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">Album Dokumentasi</h2>
            <p className="text-sm text-gray-400 mt-1">
              {items.length > 0 ? `${items.length} foto tersedia` : "Belum ada foto"}
            </p>
          </div>
          {items.length > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full font-medium">
              <Images className="w-3.5 h-3.5" />
              {items.length} Foto
            </span>
          )}
        </div>

        <GaleriGrid items={items} />
      </div>
    </div>
  );
}

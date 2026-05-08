import type { Metadata } from "next";
import Image from "next/image";
import { Leaf } from "lucide-react";
import { listInformasiByKategoriIn } from "@/lib/data/informasi";
import PotensiClientFilter from "./_components/PotensiClientFilter";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: 'Potensi Dusun',
  description: 'Jelajahi potensi Dusun Matteko — wisata alam, UMKM lokal, dan sektor pertanian unggulan.',
  openGraph: {
    title: 'Potensi Dusun Matteko',
    description: 'Jelajahi potensi Dusun Matteko — wisata alam, UMKM lokal, dan sektor pertanian unggulan.',
  },
};

export const dynamic = "force-dynamic";

export default async function PotensiPage() {
  const potensiList = await listInformasiByKategoriIn(["wisata", "umkm", "pertanian"]);

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/potensi-produk.webp"
          alt="Potensi Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Leaf className="w-3.5 h-3.5" />
            Potensi Dusun
          </div>
          <h1 className="text-4xl font-bold mb-2">Potensi Dusun</h1>
          <p className="text-lg text-gray-200">
            Menjelajahi keunggulan wisata, UMKM, dan pertanian yang ada di dusun.
          </p>
        </div>
      </div>


      <div className="max-w-6xl mx-auto px-6 py-3 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Potensi</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Client component handles filter + grid rendering */}
        <PotensiClientFilter items={potensiList} />
      </div>
    </div>
  );
}

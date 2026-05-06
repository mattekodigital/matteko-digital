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
import PengumumanGrid from "./_components/PengumumanGrid";

export const metadata: Metadata = {
  title: "Pengumuman Dusun",
  description:
    "Pengumuman resmi dan informasi penting dari pemerintahan Dusun Matteko untuk seluruh warga desa.",
  openGraph: {
    title: "Pengumuman Dusun Matteko",
    description:
      "Pengumuman resmi dan informasi penting dari pemerintahan Dusun Matteko.",
  },
};

export const dynamic = "force-dynamic";

export default async function PengumumanPage() {
  const list = await listInformasiByKategori("pengumuman");

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/pengumuman-board.webp"
          alt="Pengumuman Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent" />
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Megaphone className="w-3.5 h-3.5" />
            Pengumuman Resmi
          </div>
          <h1 className="text-4xl font-bold mb-2">Pengumuman Dusun</h1>
          <p className="text-lg text-gray-200">
            Informasi dan pengumuman penting untuk warga dusun.
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
              <BreadcrumbPage>Pengumuman</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        <PengumumanGrid items={list} />
      </div>
    </div>
  );
}

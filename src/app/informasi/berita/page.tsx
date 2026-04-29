import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Calendar, User, ArrowRight, Megaphone } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { InformasiDesa } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: 'Berita Dusun',
  description: 'Kumpulan berita dan artikel terbaru seputar kegiatan, pembangunan, dan informasi Dusun Matteko.',
  openGraph: {
    title: 'Berita Dusun Matteko',
    description: 'Kumpulan berita dan artikel terbaru seputar kegiatan dan pembangunan Dusun Matteko.',
  },
};

export const revalidate = 300;


function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, maxLength = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

export default async function BeritaPage() {
  const supabase = await createClient();

  const { data: beritaList, error } = await supabase
    .from("informasi_dusun")
    .select("id, judul, konten, image_url, penulis, tanggal_kegiatan, created_at, kategori, lokasi")
    .eq("kategori", "berita")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching berita:", error.message);
  }

  const items: InformasiDesa[] = beritaList ?? [];

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

        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>

        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Megaphone className="w-3.5 h-3.5" />
            Berita Resmi
          </div>
          <h1 className="text-4xl font-bold mb-2">Berita Dusun</h1>
          <p className="text-lg text-gray-200">Kumpulan berita dan artikel terbaru seputar dusun.</p>
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
        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <p className="text-lg font-medium">Belum ada berita yang dipublikasikan.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow group"
            >
              {/* Thumbnail */}
              <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                <Image
                  src={item.image_url || "/bg.jpg"}
                  alt={item.judul}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3">
                  <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                    <Megaphone className="w-2.5 h-2.5" />
                    {item.kategori}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex items-center text-xs text-gray-400 mb-3 gap-3">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    {formatDate(item.tanggal_kegiatan ?? item.created_at)}
                  </div>
                  {item.penulis && (
                    <div className="flex items-center gap-1">
                      <User className="w-3 h-3" />
                      {item.penulis}
                    </div>
                  )}
                </div>

                <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2 line-clamp-2">
                  {item.judul}
                </h3>

                <p className="text-gray-500 text-sm line-clamp-3 mb-4">
                  {truncate(item.konten)}
                </p>

                <div className="mt-auto">
                  <Link
                    href={`/informasi/berita/${item.id}`}
                    className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline"
                  >
                    Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

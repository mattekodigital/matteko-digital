import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, Image as ImageIcon, Megaphone } from "lucide-react";
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
  title: 'Pengumuman Desa',
  description: 'Pengumuman resmi dan informasi penting dari pemerintahan Dusun Matteko untuk seluruh warga desa.',
  openGraph: {
    title: 'Pengumuman Desa Matteko',
    description: 'Pengumuman resmi dan informasi penting dari pemerintahan Dusun Matteko.',
  },
};

export const revalidate = 300; // ISR: revalidate every 5 minutes

function getDay(dateString: string | null): string {
  if (!dateString) return "--";
  return new Date(dateString).getDate().toString().padStart(2, "0");
}

function getMonth(dateString: string | null): string {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("id-ID", { month: "short" });
}

function getYear(dateString: string | null): string {
  if (!dateString) return "----";
  return new Date(dateString).getFullYear().toString();
}

function formatRelative(dateString: string | null): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default async function PengumumanPage() {
  const supabase = await createClient();

  const { data } = await supabase
    .from("informasi_dusun")
    .select("id, judul, konten, image_url, penulis, tanggal_kegiatan, created_at, kategori, lokasi")
    .eq("kategori", "pengumuman")
    .order("created_at", { ascending: false });

  const list: InformasiDesa[] = data ?? [];

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
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
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
        {list.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-gray-400">
            <Megaphone className="w-12 h-12 mb-4 opacity-30" />
            <p className="text-lg font-medium">Belum ada pengumuman.</p>
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {list.map((item) => {
              const displayDate = item.tanggal_kegiatan ?? item.created_at;
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 items-start hover:shadow-md transition-shadow"
                >
                  {/* Date card */}
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[80px] text-blue-600 flex-shrink-0">
                    <span className="text-2xl font-bold leading-none">
                      {getDay(displayDate)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight mt-1 text-blue-400">
                      {getMonth(displayDate)}
                      <br />
                      {getYear(displayDate)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelative(displayDate)}
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        <Megaphone className="w-2.5 h-2.5" />
                        Pengumuman
                      </span>
                    </div>
                    <h3 className="font-bold text-blue-700 text-lg leading-snug mb-2 line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {item.konten.slice(0, 160)}...
                    </p>

                    {item.image_url && (
                      <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded-lg w-fit mb-3 border border-yellow-200">
                        <ImageIcon className="w-4 h-4 text-yellow-500" />
                        Ada lampiran gambar
                      </div>
                    )}

                    <Link
                      href={`/informasi/pengumuman/${item.id}`}
                      className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline w-fit"
                    >
                      Baca Detail Pengumuman <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

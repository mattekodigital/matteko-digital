import Image from "next/image";
import Link from "next/link";
import { Calendar, MapPin, Images, ArrowRight } from "lucide-react";
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

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-5 border border-purple-100">
        <Images className="w-9 h-9 text-purple-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600 mb-1">
        Belum Ada Foto
      </h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Dokumentasi foto kegiatan desa akan ditampilkan di sini.
      </p>
    </div>
  );
}

// ─── Gallery Card ─────────────────────────────────────────────────────────────

function GalleryCard({ item }: { item: InformasiDesa }) {
  return (
    <Link
      href={`/informasi/galeri/${item.id}`}
      className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex flex-col"
    >
      {/* Image Area */}
      <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
        <Image
          src={item.image_url || "/bg.jpg"}
          alt={item.judul}
          fill
          className="object-cover transition-transform duration-500 group-hover:scale-110"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

        {/* Label Badge */}
        <div className="absolute top-3 left-3">
          <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
            <Images className="w-2.5 h-2.5" />
            Galeri
          </span>
        </div>

        {/* Hover CTA */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
          <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-purple-700 font-semibold text-sm px-5 py-2.5 rounded-full shadow-md">
            Lihat Foto <ArrowRight className="w-4 h-4" />
          </span>
        </div>
      </div>

      {/* Card Info */}
      <div className="p-4 flex flex-col gap-1.5">
        <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
          {item.judul}
        </h3>

        <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
          <span className="flex items-center gap-1">
            <Calendar className="w-3 h-3 shrink-0" />
            {formatDate(item.tanggal_kegiatan ?? item.created_at)}
          </span>
          {item.lokasi && (
            <span className="flex items-center gap-1 truncate max-w-[140px]">
              <MapPin className="w-3 h-3 shrink-0" />
              {item.lokasi}
            </span>
          )}
        </div>

        {item.konten && (
          <p className="text-gray-400 text-xs leading-relaxed mt-1 line-clamp-2">
            {truncate(item.konten)}
          </p>
        )}
      </div>
    </Link>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GaleriPage() {
  const supabase = await createClient();

  const { data: galeriData, error } = await supabase
    .from("informasi_dusun")
    .select(
      "id, judul, konten, image_url, penulis, tanggal_kegiatan, lokasi, created_at, kategori"
    )
    .eq("kategori", "galeri")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching galeri:", error.message);
  }

  const items: InformasiDesa[] = galeriData ?? [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Hero ───────────────────────────────────────────────────── */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/galeri-kegiatan.webp"
          alt="Galeri Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Images className="w-3.5 h-3.5" />
            Dokumentasi Visual
          </div>
          <h1 className="text-4xl font-bold mb-2 drop-shadow-md">
            Galeri Dusun
          </h1>
          <p className="text-gray-200 text-base max-w-md">
            Dokumentasi foto dan kegiatan Dusun Matteko dalam gambar.
          </p>
        </div>
      </div>

      {/* ── Breadcrumb ─────────────────────────────────────────────── */}
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

      {/* ── Gallery Grid ───────────────────────────────────────────── */}
      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Section header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Album Dokumentasi
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              {items.length > 0
                ? `${items.length} foto tersedia`
                : "Belum ada foto"}
            </p>
          </div>
          {items.length > 0 && (
            <span className="hidden md:inline-flex items-center gap-1.5 text-xs text-purple-600 bg-purple-50 border border-purple-100 px-3 py-1.5 rounded-full font-medium">
              <Images className="w-3.5 h-3.5" />
              {items.length} Foto
            </span>
          )}
        </div>

        {/* Empty State */}
        {items.length === 0 && <EmptyState />}

        {/* Grid */}
        {items.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item) => (
              <GalleryCard key={item.id} item={item} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Calendar, User, ArrowLeft, ArrowRight, Tag, MapPin } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { InformasiDesa } from "@/lib/types";

// ─── Helper ────────────────────────────────────────────────────────────────────
function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

// ─── Page ──────────────────────────────────────────────────────────────────────
export default async function BeritaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch artikel utama
  const { data: article, error } = await supabase
    .from("informasi_dusun")
    .select("*")
    .eq("id", id)
    .eq("kategori", "berita")
    .single();

  if (error || !article) {
    notFound();
  }

  const item = article as InformasiDesa;

  // Fetch berita terkait (selain artikel ini)
  const { data: relatedData } = await supabase
    .from("informasi_dusun")
    .select("id, judul, konten, image_url, penulis, tanggal_kegiatan, created_at, kategori, lokasi")

    .eq("kategori", "berita")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(3);

  const relatedList: InformasiDesa[] = relatedData ?? [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Hero Banner ──────────────────────────────────────────── */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={item.image_url || "/bg.jpg"}
          alt={item.judul}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-4xl mx-auto w-full left-0 right-0">
          <span className="inline-flex items-center gap-1.5 bg-blue-600 text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase">
            <Tag className="w-3 h-3" />
            {item.kategori}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug drop-shadow-md">
            {item.judul}
          </h1>
        </div>
      </div>

      {/* ── Article Container ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        {/* Back Navigation */}
        <Link
          href="/informasi/berita"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Berita
        </Link>

        {/* ── Meta Info ─────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{formatDate(item.tanggal_kegiatan ?? item.created_at)}</span>
          </div>
          {item.penulis && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-blue-500" />
              <span>{item.penulis}</span>
            </div>
          )}
          {item.lokasi && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-blue-500" />
              <span>{item.lokasi}</span>
            </div>
          )}
        </div>

        {/* ── Article Content ───────────────────────────────────────── */}
        <article>
          {/* Featured Image inside content */}
          {item.image_url && (
            <figure className="mb-8">
              <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-md">
                <Image
                  src={item.image_url}
                  alt={item.judul}
                  fill
                  className="object-cover"
                />
              </div>
            </figure>
          )}

          {/* Konten artikel — rendered as paragraphs split by newline */}
          <div className="space-y-5">
            {item.konten.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Heading detection: baris yang diawali ## atau diapit **
              if (trimmed.startsWith("##")) {
                return (
                  <h2
                    key={index}
                    className="text-xl md:text-2xl font-bold text-gray-800 pt-4"
                  >
                    {trimmed.replace(/^##\s*/, "")}
                  </h2>
                );
              }

              return (
                <p
                  key={index}
                  className="text-gray-700 text-base md:text-[17px] leading-relaxed tracking-wide"
                >
                  {trimmed}
                </p>
              );
            })}
          </div>
        </article>

        {/* ── Action Bar ────────────────────────────────────────────────────── */}
        <div className="mt-12 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          {/* Tags */}
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Tag:</span>
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium capitalize">
              {item.kategori}
            </span>
            {item.lokasi && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
                {item.lokasi}
              </span>
            )}
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
              Desa Matteko
            </span>
          </div>

          {/* Back button */}
          <Link
            href="/informasi/berita"
            className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>

      {/* ── Related Articles ──────────────────────────────────────── */}
      {relatedList.length > 0 && (
        <div className="bg-white border-t border-gray-100 mt-4 py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">Berita Terkait</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedList.map((related) => (
                <Link
                  key={related.id}
                  href={`/informasi/berita/${related.id}`}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
                >
                  <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={related.image_url || "/bg.jpg"}
                      alt={related.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      {related.kategori}
                    </div>
                  </div>
                  <div className="p-5 flex flex-col flex-1">
                    <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(related.tanggal_kegiatan ?? related.created_at).toLocaleDateString("id-ID", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </div>
                    <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 mb-2 group-hover:text-blue-600 transition-colors">
                      {related.judul}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                      {related.konten.slice(0, 120)}...
                    </p>
                    <div className="mt-auto flex items-center gap-1 text-blue-600 font-semibold text-sm">
                      Baca Selengkapnya <ArrowRight className="w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

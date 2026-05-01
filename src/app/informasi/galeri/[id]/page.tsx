import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  MapPin,
  User,
  ArrowLeft,
  Images,
  ArrowRight,
} from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import type { InformasiDesa } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function formatDateLong(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function formatDateShort(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default async function GaleriDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const supabase = await createClient();

  // Fetch foto utama
  const { data: foto, error } = await supabase
    .from("informasi_dusun")
    .select("*")
    .eq("id", id)
    .eq("kategori", "galeri")
    .single();

  if (error || !foto) {
    notFound();
  }

  const item = foto as InformasiDesa;

  // Fetch galeri terkait (selain foto ini)
  const { data: relatedData } = await supabase
    .from("informasi_dusun")
    .select(
      "id, judul, konten, image_url, penulis, tanggal_kegiatan, lokasi, created_at, kategori"
    )
    .eq("kategori", "galeri")
    .neq("id", id)
    .order("created_at", { ascending: false })
    .limit(4);

  const relatedList: InformasiDesa[] = relatedData ?? [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Hero — Full-bleed featured image ─────────────────────── */}
      <div className="relative w-full h-[50vh] md:h-[65vh] overflow-hidden bg-gray-900">
        <Image
          src={item.image_url || "/bg.jpg"}
          alt={item.judul}
          fill
          className="object-cover opacity-90"
          priority
        />
        {/* Gradient overlay from bottom */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/10" />
        {/* Purple tint at top */}
        <div className="absolute inset-0 bg-gradient-to-br from-purple-900/40 to-transparent" />

        {/* Overlay content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-5xl mx-auto w-full left-0 right-0">
          <span className="inline-flex items-center gap-1.5 bg-purple-600 text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase tracking-wider shadow">
            <Images className="w-3 h-3" />
            Galeri Foto
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug drop-shadow-md max-w-3xl">
            {item.judul}
          </h1>
        </div>
      </div>

      {/* ── Main Content ──────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-4 md:px-6 py-10">
        {/* Back link */}
        <Link
          href="/informasi/galeri"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-purple-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali ke Galeri
        </Link>

        {/* ── Meta strip ────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-5 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-purple-500 shrink-0" />
            <span>{formatDateLong(item.tanggal_kegiatan ?? item.created_at)}</span>
          </div>
          {item.penulis && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-purple-500 shrink-0" />
              <span>{item.penulis}</span>
            </div>
          )}
          {item.lokasi && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-purple-500 shrink-0" />
              <span>{item.lokasi}</span>
            </div>
          )}
        </div>

        {/* ── Large Featured Photo (repeated for emphasis in context) ── */}
        {item.image_url && (
          <figure className="mb-10">
            <div className="relative w-full aspect-[16/9] md:aspect-[16/8] rounded-2xl overflow-hidden shadow-lg border border-gray-100">
              <Image
                src={item.image_url}
                alt={item.judul}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 100vw, 80vw"
              />
            </div>
            <figcaption className="text-center text-xs text-gray-400 mt-3 italic">
              {item.judul}
              {item.lokasi && ` — ${item.lokasi}`}
            </figcaption>
          </figure>
        )}

        {/* ── Description / Keterangan ────────────────────────────── */}
        {item.konten && (
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 mb-10">
            <h2 className="text-base font-semibold text-purple-700 mb-3 uppercase tracking-wide text-xs">
              Keterangan
            </h2>
            <div className="space-y-4">
              {item.konten.split("\n").map((paragraph, index) => {
                const trimmed = paragraph.trim();
                if (!trimmed) return null;
                if (trimmed.startsWith("##")) {
                  return (
                    <h3
                      key={index}
                      className="text-lg font-bold text-gray-800 pt-2"
                    >
                      {trimmed.replace(/^##\s*/, "")}
                    </h3>
                  );
                }
                return (
                  <p
                    key={index}
                    className="text-gray-600 text-base leading-relaxed"
                  >
                    {trimmed}
                  </p>
                );
              })}
            </div>
          </div>
        )}

        {/* ── Tag pills ──────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-2 pt-2">
          <span className="text-sm text-gray-400 font-medium">Tag:</span>
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full font-medium capitalize">
            Galeri
          </span>
          {item.lokasi && (
            <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full font-medium">
              {item.lokasi}
            </span>
          )}
          <span className="text-xs bg-purple-50 text-purple-700 border border-purple-100 px-3 py-1 rounded-full font-medium">
            Desa Matteko
          </span>
        </div>
      </div>

      {/* ── Related Gallery ────────────────────────────────────────── */}
      {relatedList.length > 0 && (
        <div className="bg-white border-t border-gray-100 mt-4 py-14">
          <div className="max-w-7xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Foto Lainnya
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {relatedList.map((related) => (
                <Link
                  key={related.id}
                  href={`/informasi/galeri/${related.id}`}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 aspect-square shadow-sm border border-gray-100 hover:shadow-md hover:border-purple-100 transition-all duration-300"
                >
                  <Image
                    src={related.image_url || "/bg.jpg"}
                    alt={related.judul}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-110"
                    sizes="(max-width: 640px) 50vw, 25vw"
                  />
                  {/* Bottom overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div className="absolute bottom-0 left-0 right-0 p-3 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                    <p className="text-white text-xs font-semibold line-clamp-2 leading-tight">
                      {related.judul}
                    </p>
                    <span className="text-gray-300 text-[10px] flex items-center gap-1 mt-0.5">
                      <Calendar className="w-2.5 h-2.5" />
                      {formatDateShort(related.tanggal_kegiatan ?? related.created_at)}
                    </span>
                  </div>
                  {/* Arrow CTA */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    <span className="inline-flex items-center justify-center w-7 h-7 bg-white/90 rounded-full">
                      <ArrowRight className="w-3.5 h-3.5 text-purple-700" />
                    </span>
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

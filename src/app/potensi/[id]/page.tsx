import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  MapPin,
  User,
  Calendar,
  Tag,
} from "lucide-react";
import {
  getInformasiByIdAndKategoriIn,
  listRelatedInformasi,
} from "@/lib/data/informasi";
import type { InformasiDesa } from "@/lib/types";

// ─── Helpers ──────────────────────────────────────────────────────────────────
function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

const CATEGORY_LABELS: Record<string, string> = {
  wisata: "Wisata",
  umkm: "UMKM",
  pertanian: "Pertanian",
};

const CATEGORY_COLORS: Record<string, string> = {
  wisata: "bg-emerald-500",
  umkm: "bg-[#f4a100]",
  pertanian: "bg-lime-600",
};

// ─── Page ─────────────────────────────────────────────────────────────────────
export default async function PotensiDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const item = await getInformasiByIdAndKategoriIn(id, ["wisata", "umkm", "pertanian"]);

  if (!item) {
    notFound();
  }

  const potensi = item as InformasiDesa;

  const relatedList = await listRelatedInformasi(potensi.kategori, id, { limit: 3 });

  const badgeColor = CATEGORY_COLORS[potensi.kategori] ?? "bg-gray-400";
  const categoryLabel = CATEGORY_LABELS[potensi.kategori] ?? potensi.kategori;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Hero Banner ───────────────────────────────────────────── */}
      <div className="relative h-[400px] md:h-[500px] w-full overflow-hidden">
        <Image
          src={potensi.image_url || "/bg.jpg"}
          alt={potensi.judul}
          fill
          className="object-cover"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-black/10" />
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-4xl mx-auto w-full left-0 right-0">
          <span
            className={`inline-flex items-center gap-1.5 ${badgeColor} text-white text-[11px] font-bold px-3 py-1 rounded-full w-fit mb-4 uppercase`}
          >
            <Tag className="w-3 h-3" />
            {categoryLabel}
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug drop-shadow-md">
            {potensi.judul}
          </h1>
        </div>
      </div>

      {/* ── Content Container ─────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">
        {/* Back Navigation */}
        <Link
          href="/potensi"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#f4a100] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        {/* Meta Info */}
        <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          {potensi.tanggal_kegiatan || potensi.created_at ? (
            <div className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-[#f4a100]" />
              <span>{formatDate(potensi.tanggal_kegiatan ?? potensi.created_at)}</span>
            </div>
          ) : null}
          {potensi.penulis && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#f4a100]" />
              <span>{potensi.penulis}</span>
            </div>
          )}
          {potensi.lokasi && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-[#f4a100]" />
              <span>{potensi.lokasi}</span>
            </div>
          )}
        </div>

        {/* Featured Image */}
        {potensi.image_url && (
          <figure className="mb-8">
            <div className="relative w-full h-64 md:h-96 rounded-2xl overflow-hidden shadow-md">
              <Image
                src={potensi.image_url}
                alt={potensi.judul}
                fill
                className="object-cover"
              />
            </div>
          </figure>
        )}

        {/* Article Content */}
        <article>
          <div className="space-y-5">
            {potensi.konten.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

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

        {/* Tags + Back button */}
        <div className="mt-10 pt-6 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-sm text-gray-500 font-medium">Tag:</span>
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-medium capitalize">
              {categoryLabel}
            </span>
            {potensi.lokasi && (
              <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-medium">
                {potensi.lokasi}
              </span>
            )}
            <span className="text-xs bg-amber-50 text-amber-700 border border-amber-100 px-3 py-1 rounded-full font-medium">
              Dusun Matteko
            </span>
          </div>

          <Link
            href="/potensi"
            className="inline-flex items-center gap-2 text-sm bg-[#f4a100] hover:bg-[#d98f00] text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>

      {/* ── Related Items ──────────────────────────────────────────── */}
      {relatedList.length > 0 && (
        <div className="bg-white border-t border-gray-100 mt-4 py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-8">
              Potensi Terkait
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedList.map((related) => {
                const relBadge = CATEGORY_COLORS[related.kategori] ?? "bg-gray-400";
                const relLabel = CATEGORY_LABELS[related.kategori] ?? related.kategori;
                return (
                  <Link
                    key={related.id}
                    href={`/potensi/${related.id}`}
                    className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="relative h-44 w-full bg-gray-200 overflow-hidden">
                      <Image
                        src={related.image_url || "/bg.jpg"}
                        alt={related.judul}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div
                        className={`absolute top-3 left-3 ${relBadge} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase`}
                      >
                        {relLabel}
                      </div>
                    </div>
                    <div className="p-5 flex flex-col flex-1">
                      <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
                        <Calendar className="w-3 h-3" />
                        {new Date(
                          related.tanggal_kegiatan ?? related.created_at
                        ).toLocaleDateString("id-ID", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        })}
                      </div>
                      <h3 className="font-bold text-gray-800 leading-snug line-clamp-2 mb-2 group-hover:text-[#f4a100] transition-colors">
                        {related.judul}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-4">
                        {related.konten.slice(0, 100)}...
                      </p>
                      <div className="mt-auto flex items-center gap-1 text-[#f4a100] font-semibold text-sm">
                        Lihat Detail <ArrowRight className="w-4 h-4" />
                      </div>
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

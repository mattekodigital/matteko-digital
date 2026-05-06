import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  MapPin,
  Megaphone,
  Image as ImageIcon,
  Clock,
} from "lucide-react";
import { getInformasiByIdAndKategori, listRelatedInformasi } from "@/lib/data/informasi";
import type { InformasiDesa } from "@/lib/types";

// ─── Helpers ───────────────────────────────────────────────────────────────────

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

function getDay(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).getDate().toString().padStart(2, "0");
}

function getMonthYear(dateString: string | null): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function PengumumanDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const announcement = await getInformasiByIdAndKategori(id, "pengumuman");

  if (!announcement) {
    notFound();
  }

  const item = announcement as InformasiDesa;
  const displayDate = item.tanggal_kegiatan ?? item.created_at;

  const relatedList = await listRelatedInformasi("pengumuman", id, { limit: 3 });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative h-[380px] md:h-[480px] w-full overflow-hidden">
        <Image
          src={item.image_url || "/bg.jpg"}
          alt={item.judul}
          fill
          className="object-cover"
          priority
        />
        {/* gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/50 to-black/20" />

        {/* Hero content */}
        <div className="absolute inset-0 flex flex-col justify-end px-6 pb-10 max-w-4xl mx-auto w-full left-0 right-0">
          {/* PENGUMUMAN badge */}
          <span className="inline-flex items-center gap-2 bg-blue-600 text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-widest shadow-md">
            <Megaphone className="w-3.5 h-3.5" />
            Pengumuman Resmi
          </span>
          <h1 className="text-2xl md:text-4xl font-bold text-white leading-snug drop-shadow-lg max-w-3xl">
            {item.judul}
          </h1>
          <p className="mt-3 text-sm text-gray-300 flex items-center gap-2">
            <Clock className="w-4 h-4" />
            {formatDateLong(displayDate)}
          </p>
        </div>
      </div>

      {/* ── Main Container ─────────────────────────────────────────────────── */}
      <div className="max-w-4xl mx-auto px-4 md:px-6 py-10">

        {/* Back Navigation */}
        <Link
          href="/informasi/pengumuman"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        {/* ── Official Notice Block ─────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-5 bg-blue-50 border border-blue-200 rounded-2xl p-5 mb-8 shadow-sm">
          {/* Date card */}
          <div className="flex-shrink-0 bg-blue-600 text-white rounded-xl px-6 py-4 flex flex-col items-center justify-center min-w-[90px] shadow-md">
            <span className="text-3xl font-extrabold leading-none">
              {getDay(displayDate)}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide mt-1 text-blue-100 text-center leading-tight">
              {getMonthYear(displayDate)}
            </span>
          </div>

          {/* Notice text */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-1.5">
              <Megaphone className="w-5 h-5 text-blue-600" />
              <span className="text-sm font-bold text-blue-700 uppercase tracking-wider">
                Pengumuman Penting
              </span>
            </div>
            <p className="text-gray-700 text-sm leading-relaxed">
              Pemerintah Dusun Matteko mengumumkan informasi berikut kepada
              seluruh warga. Harap membaca dengan seksama dan menyebarluaskan
              kepada yang membutuhkan.
            </p>
          </div>
        </div>

        {/* ── Meta Information ──────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-blue-500" />
            <span>{formatDateLong(displayDate)}</span>
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

        {/* ── Article Content ───────────────────────────────────────────────── */}
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
              {/* Attachment label */}
              <figcaption className="mt-3 flex items-center gap-2 bg-yellow-50 border border-yellow-200 text-yellow-800 text-xs font-medium px-4 py-2 rounded-lg w-fit">
                <ImageIcon className="w-4 h-4 text-yellow-500" />
                Ada lampiran gambar pada pengumuman ini
              </figcaption>
            </figure>
          )}

          {/* Content paragraphs */}
          <div className="space-y-5">
            {item.konten.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              // Heading: lines starting with ##
              if (trimmed.startsWith("##")) {
                return (
                  <h2
                    key={index}
                    className="text-xl md:text-2xl font-bold text-gray-800 pt-4 border-l-4 border-blue-500 pl-4"
                  >
                    {trimmed.replace(/^##\s*/, "")}
                  </h2>
                );
              }

              // Sub-heading: lines starting with #
              if (trimmed.startsWith("#")) {
                return (
                  <h3
                    key={index}
                    className="text-lg font-semibold text-gray-700 pt-2"
                  >
                    {trimmed.replace(/^#\s*/, "")}
                  </h3>
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
              Pengumuman
            </span>
            {item.lokasi && (
              <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
                {item.lokasi}
              </span>
            )}
            <span className="text-xs bg-blue-50 text-blue-700 border border-blue-100 px-3 py-1 rounded-full font-medium">
              Dusun Matteko
            </span>
          </div>

          {/* Action buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/informasi/pengumuman"
              className="inline-flex items-center gap-2 text-sm bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
            >
              <ArrowLeft className="w-4 h-4" />
              Kembali
            </Link>
          </div>
        </div>
      </div>

      {/* ── Related Announcements ──────────────────────────────────────────── */}
      {relatedList.length > 0 && (
        <div className="bg-white border-t border-gray-100 mt-4 py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-blue-600 rounded-full" />
              <h2 className="text-2xl font-bold text-gray-800">
                Pengumuman Lainnya
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedList.map((related) => {
                const relDate =
                  related.tanggal_kegiatan ?? related.created_at;
                return (
                  <Link
                    key={related.id}
                    href={`/informasi/pengumuman/${related.id}`}
                    className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex gap-4 p-4 hover:shadow-md hover:border-blue-100 transition-all"
                  >
                    {/* Date chip */}
                    <div className="flex-shrink-0 bg-blue-50 border border-blue-100 rounded-xl px-3 py-3 flex flex-col items-center justify-center min-w-[60px] text-blue-600">
                      <span className="text-xl font-extrabold leading-none">
                        {getDay(relDate)}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wide text-center leading-tight mt-1 text-blue-400">
                        {getMonthYear(relDate)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                        <Megaphone className="w-3 h-3 text-blue-400" />
                        Pengumuman
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-blue-600 transition-colors mb-2">
                        {related.judul}
                      </h3>
                      <p className="text-gray-500 text-xs line-clamp-2 mb-3">
                        {related.konten.slice(0, 100)}...
                      </p>
                      <div className="mt-auto flex items-center gap-1 text-blue-600 font-semibold text-xs">
                        Baca Detail{" "}
                        <ArrowRight className="w-3 h-3" />
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

import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  Calendar,
  User,
  ArrowLeft,
  ArrowRight,
  MapPin,
  CalendarDays,
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

function getDay(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).getDate().toString().padStart(2, "0");
}

function getMonthYear(dateString: string | null): string {
  if (!dateString) return "-";
  const d = new Date(dateString);
  return d.toLocaleDateString("id-ID", { month: "short", year: "numeric" });
}

function getStatus(dateString: string | null): "Akan Datang" | "Berlangsung" | "Selesai" {
  if (!dateString) return "Akan Datang";
  const now = new Date();
  const eventDate = new Date(dateString);
  const eventEnd = new Date(dateString);
  eventEnd.setHours(23, 59, 59);

  if (now < eventDate) return "Akan Datang";
  if (now <= eventEnd) return "Berlangsung";
  return "Selesai";
}

const statusStyle: Record<string, string> = {
  "Akan Datang": "bg-green-50 text-[#108c64] border-green-200",
  "Berlangsung": "bg-blue-50 text-blue-600 border-blue-200",
  "Selesai": "bg-gray-100 text-gray-500 border-gray-200",
};

const statusDot: Record<string, string> = {
  "Akan Datang": "bg-[#108c64]",
  "Berlangsung": "bg-blue-500",
  "Selesai": "bg-gray-400",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function AgendaDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const agenda = await getInformasiByIdAndKategori(id, "agenda");

  if (!agenda) {
    notFound();
  }

  const item = agenda as InformasiDesa;
  const displayDate = item.tanggal_kegiatan ?? item.created_at;
  const status = getStatus(item.tanggal_kegiatan);

  const relatedList = await listRelatedInformasi("agenda", id, {
    orderBy: "tanggal_kegiatan",
    ascending: true,
    limit: 3,
  });

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* ── Hero Banner ───────────────────────────────────────────────────── */}
      <div className="relative h-[380px] md:h-[460px] w-full overflow-hidden">
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
          {/* AGENDA badge */}
          <span className="inline-flex items-center gap-2 bg-[#108c64] text-white text-[11px] font-extrabold px-4 py-1.5 rounded-full w-fit mb-4 uppercase tracking-widest shadow-md">
            <CalendarDays className="w-3.5 h-3.5" />
            Agenda Kegiatan
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
          href="/informasi/agenda"
          className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-[#108c64] transition-colors mb-8 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
          Kembali
        </Link>

        {/* ── Info Summary Block ─────────────────────────────────────────────── */}
        <div className="flex flex-col sm:flex-row gap-5 bg-green-50 border border-green-200 rounded-2xl p-5 mb-8 shadow-sm">
          {/* Date card */}
          <div className="flex-shrink-0 bg-[#108c64] text-white rounded-xl px-6 py-4 flex flex-col items-center justify-center min-w-[90px] shadow-md">
            <span className="text-3xl font-extrabold leading-none">
              {getDay(displayDate)}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wide mt-1 text-green-100 text-center leading-tight">
              {getMonthYear(displayDate)}
            </span>
          </div>

          {/* Summary info */}
          <div className="flex flex-col justify-center gap-3">
            <div className="flex items-center gap-2">
              <CalendarDays className="w-5 h-5 text-[#108c64]" />
              <span className="text-sm font-bold text-green-800 uppercase tracking-wider">
                Informasi Kegiatan
              </span>
            </div>
            <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-600">
              {item.lokasi && (
                <div className="flex items-center gap-1.5">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span>{item.lokasi}</span>
                </div>
              )}
              {item.penulis && (
                <div className="flex items-center gap-1.5">
                  <User className="w-4 h-4 text-[#108c64]" />
                  <span>{item.penulis}</span>
                </div>
              )}
              <span
                className={`inline-flex items-center gap-1.5 text-xs font-bold px-3 py-1 rounded-full border ${statusStyle[status]}`}
              >
                <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
                {status}
              </span>
            </div>
          </div>
        </div>

        {/* ── Meta ──────────────────────────────────────────────────────────── */}
        <div className="flex flex-wrap items-center gap-x-6 gap-y-3 text-sm text-gray-500 mb-8 pb-6 border-b border-gray-200">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-[#108c64]" />
            <span>{formatDateLong(displayDate)}</span>
          </div>
          {item.penulis && (
            <div className="flex items-center gap-1.5">
              <User className="w-4 h-4 text-[#108c64]" />
              <span>{item.penulis}</span>
            </div>
          )}
          {item.lokasi && (
            <div className="flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-red-500" />
              <span>{item.lokasi}</span>
            </div>
          )}
        </div>

        {/* ── Article Content ───────────────────────────────────────────────── */}
        <article>
          {/* Featured Image */}
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

          {/* Content paragraphs */}
          <div className="space-y-5">
            {item.konten.split("\n").map((paragraph, index) => {
              const trimmed = paragraph.trim();
              if (!trimmed) return null;

              if (trimmed.startsWith("##")) {
                return (
                  <h2
                    key={index}
                    className="text-xl md:text-2xl font-bold text-gray-800 pt-4 border-l-4 border-[#108c64] pl-4"
                  >
                    {trimmed.replace(/^##\s*/, "")}
                  </h2>
                );
              }

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
            <span className="text-xs bg-green-50 text-[#108c64] border border-green-100 px-3 py-1 rounded-full font-medium">
              Agenda
            </span>
            {item.lokasi && (
              <span className="text-xs bg-green-50 text-[#108c64] border border-green-100 px-3 py-1 rounded-full font-medium">
                {item.lokasi}
              </span>
            )}
            <span className="text-xs bg-green-50 text-[#108c64] border border-green-100 px-3 py-1 rounded-full font-medium">
              Dusun Matteko
            </span>
          </div>

          {/* Back button */}
          <Link
            href="/informasi/agenda"
            className="inline-flex items-center gap-2 text-sm bg-[#108c64] hover:bg-[#0d7a56] text-white font-semibold px-5 py-2 rounded-lg transition-colors shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Kembali
          </Link>
        </div>
      </div>

      {/* ── Agenda Terkait ──────────────────────────────────────────────────── */}
      {relatedList.length > 0 && (
        <div className="bg-white border-t border-gray-100 mt-4 py-14">
          <div className="max-w-6xl mx-auto px-4 md:px-6">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-1 h-7 bg-[#108c64] rounded-full" />
              <h2 className="text-2xl font-bold text-gray-800">Agenda Lainnya</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {relatedList.map((related) => {
                const relDate = related.tanggal_kegiatan ?? related.created_at;
                const relStatus = getStatus(related.tanggal_kegiatan);
                return (
                  <Link
                    key={related.id}
                    href={`/informasi/agenda/${related.id}`}
                    className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex gap-4 p-4 hover:shadow-md hover:border-green-100 transition-all"
                  >
                    {/* Date chip */}
                    <div className="flex-shrink-0 bg-green-50 border border-green-100 rounded-xl px-3 py-3 flex flex-col items-center justify-center min-w-[60px] text-[#108c64]">
                      <span className="text-xl font-extrabold leading-none">
                        {getDay(relDate)}
                      </span>
                      <span className="text-[9px] font-bold uppercase tracking-wide text-center leading-tight mt-1 text-green-400">
                        {getMonthYear(relDate)}
                      </span>
                    </div>

                    {/* Content */}
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="flex items-center gap-1 text-[11px] text-gray-400 mb-1">
                        <CalendarDays className="w-3 h-3 text-[#108c64]" />
                        {relStatus}
                      </div>
                      <h3 className="font-bold text-gray-800 text-sm leading-snug line-clamp-2 group-hover:text-[#108c64] transition-colors mb-2">
                        {related.judul}
                      </h3>
                      {related.lokasi && (
                        <p className="text-gray-400 text-xs flex items-center gap-1 mb-2">
                          <MapPin className="w-3 h-3" />
                          {related.lokasi}
                        </p>
                      )}
                      <div className="mt-auto flex items-center gap-1 text-[#108c64] font-semibold text-xs">
                        Lihat Detail <ArrowRight className="w-3 h-3" />
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

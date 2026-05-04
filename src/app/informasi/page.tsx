import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import {
  Calendar,
  User,
  ArrowRight,
  Clock,
  MapPin,
  Images,
  Megaphone,
  CalendarDays,
  Newspaper,
} from "lucide-react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { createClient } from "@/lib/supabase/server";
import type { InformasiDesa } from "@/lib/types";

export const metadata: Metadata = {
  title: 'Pusat Informasi Desa',
  description: 'Pusat informasi Dusun Matteko — berita terkini, pengumuman resmi, agenda kegiatan, dan galeri foto desa.',
  openGraph: {
    title: 'Pusat Informasi Desa Matteko',
    description: 'Berita terkini, pengumuman resmi, agenda kegiatan, dan galeri foto Dusun Matteko.',
  },
};

export const revalidate = 300;

function formatDate(d: string | null) {
  if (!d) return "-";
  return new Date(d).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function getDay(d: string | null) {
  if (!d) return "--";
  return new Date(d).getDate().toString().padStart(2, "0");
}

function getMonthYear(d: string | null) {
  if (!d) return "---";
  const date = new Date(d);
  const m = date.toLocaleDateString("id-ID", { month: "short" });
  return `${m} ${date.getFullYear()}`;
}

function getDateParts(d: string | null) {
  if (!d) return { day: "-", month: "-", dayName: "-" };
  const date = new Date(d);
  return {
    day: date.toLocaleDateString("id-ID", { day: "2-digit" }),
    month: date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    dayName: date.toLocaleDateString("id-ID", { weekday: "long" }),
  };
}

function getStatus(d: string | null): "Akan Datang" | "Berlangsung" | "Selesai" {
  if (!d) return "Akan Datang";
  const now = new Date();
  const ev = new Date(d);
  const evEnd = new Date(d);
  evEnd.setHours(23, 59, 59);
  if (now < ev) return "Akan Datang";
  if (now <= evEnd) return "Berlangsung";
  return "Selesai";
}

const statusStyle: Record<string, string> = {
  "Akan Datang": "bg-green-50 text-[#108c64]",
  "Berlangsung": "bg-blue-50 text-blue-600",
  "Selesai": "bg-gray-100 text-gray-500",
};

const statusDot: Record<string, string> = {
  "Akan Datang": "bg-[#108c64]",
  "Berlangsung": "bg-blue-500",
  "Selesai": "bg-gray-400",
};

// ─── Page ──────────────────────────────────────────────────────────────────────

export default async function InformasiPage() {
  const supabase = await createClient();

  // Fetch top 3 per category in parallel
  const [beritaRes, pengumumanRes, agendaRes, galeriRes] = await Promise.all([
    supabase
      .from("informasi_dusun")
      .select("id, judul, konten, image_url, penulis, tanggal_kegiatan, created_at, kategori, lokasi")
      .eq("kategori", "berita")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("informasi_dusun")
      .select("id, judul, konten, image_url, penulis, tanggal_kegiatan, created_at, kategori, lokasi")
      .eq("kategori", "pengumuman")
      .order("created_at", { ascending: false })
      .limit(3),
    supabase
      .from("informasi_dusun")
      .select("id, judul, konten, penulis, tanggal_kegiatan, lokasi, created_at, kategori, image_url")
      .eq("kategori", "agenda")
      .order("tanggal_kegiatan", { ascending: true })
      .limit(3),
    supabase
      .from("informasi_dusun")
      .select("id, judul, konten, image_url, penulis, tanggal_kegiatan, lokasi, created_at, kategori")
      .eq("kategori", "galeri")
      .order("created_at", { ascending: false })
      .limit(3),
  ]);

  const beritaList: InformasiDesa[] = beritaRes.data ?? [];
  const pengumumanList: InformasiDesa[] = pengumumanRes.data ?? [];
  const agendaList: InformasiDesa[] = agendaRes.data ?? [];
  const galeriList: InformasiDesa[] = galeriRes.data ?? [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/informasi.webp"
          alt="Informasi Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Newspaper className="w-3.5 h-3.5" />
            Pusat Informasi
          </div>
          <h1 className="text-4xl font-bold mb-2">Pusat Informasi</h1>
          <p className="text-lg text-gray-200">
            Kumpulan berita, pengumuman, agenda, dan galeri dusun.
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
              <BreadcrumbPage>Informasi Dusun</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-16">

        {/* ── Section: Berita ──────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Berita Terkini</h2>
              <p className="text-gray-500 text-sm mt-1">Berita dan artikel terbaru seputar desa.</p>
            </div>
            <Link
              href="/informasi/berita"
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {beritaList.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Newspaper className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada berita yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {beritaList.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow group"
                >
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={item.image_url || "/bg.jpg"}
                      alt={item.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute top-3 left-3 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase">
                      BERITA
                    </div>
                  </div>
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
                      {item.konten}
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
          )}
        </section>

        {/* ── Section: Pengumuman ──────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Pengumuman</h2>
              <p className="text-gray-500 text-sm mt-1">Informasi penting untuk warga desa.</p>
            </div>
            <Link
              href="/informasi/pengumuman"
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {pengumumanList.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Megaphone className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada pengumuman.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {pengumumanList.map((item) => {
                const displayDate = item.tanggal_kegiatan ?? item.created_at;
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 items-start hover:shadow-md transition-shadow"
                  >
                    <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[80px] text-blue-600 flex-shrink-0">
                      <span className="text-2xl font-bold leading-none">{getDay(displayDate)}</span>
                      <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight mt-1 text-blue-400">
                        {getMonthYear(displayDate)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
                        <Clock className="w-3 h-3" />
                        {formatDate(displayDate)}
                      </div>
                      <h3 className="font-bold text-blue-700 text-lg leading-snug mb-2 line-clamp-2">
                        {item.judul}
                      </h3>
                      <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                        {item.konten.slice(0, 160)}...
                      </p>
                      <Link
                        href={`/informasi/pengumuman/${item.id}`}
                        className="text-blue-600 font-semibold text-sm flex items-center gap-1 hover:underline w-fit"
                      >
                        Baca Detail <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Section: Agenda ──────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Agenda Kegiatan</h2>
              <p className="text-gray-500 text-sm mt-1">Jadwal kegiatan yang akan datang di desa.</p>
            </div>
            <Link
              href="/informasi/agenda"
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {agendaList.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <CalendarDays className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada agenda yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {agendaList.map((item) => {
                const { day, month, dayName } = getDateParts(item.tanggal_kegiatan);
                const status = getStatus(item.tanggal_kegiatan);
                return (
                  <div
                    key={item.id}
                    className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
                  >
                    <div className="bg-[#108c64] text-white p-5 flex justify-between items-start">
                      <div>
                        <span className="text-3xl font-bold leading-none block">{day}</span>
                        <span className="text-[10px] font-bold uppercase tracking-wider block mt-1 text-green-100">
                          {month}
                        </span>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] text-green-200 uppercase tracking-widest block mb-1 font-semibold">HARI</span>
                        <span className="font-bold text-lg leading-none">{dayName}</span>
                      </div>
                    </div>
                    <div className="p-6 flex-1 flex flex-col">
                      <div className="space-y-3 mb-5 border-b border-gray-100 pb-5">
                        {item.lokasi && (
                          <div className="flex gap-3 items-start">
                            <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                            <div>
                              <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">LOKASI</span>
                              <span className="block text-sm font-semibold text-gray-800">{item.lokasi}</span>
                            </div>
                          </div>
                        )}
                      </div>
                      <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2">{item.judul}</h3>
                      <p className="text-gray-500 text-sm line-clamp-3 mb-6">{item.konten}</p>
                      <div className="mt-auto flex items-center justify-between">
                        <span className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center w-fit gap-1.5 ${statusStyle[status]}`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${statusDot[status]}`} />
                          {status}
                        </span>
                        <Link
                          href={`/informasi/agenda/${item.id}`}
                          className="text-[#108c64] font-semibold text-sm flex items-center gap-1 hover:underline"
                        >
                          Selengkapnya <ArrowRight className="w-4 h-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* ── Section: Galeri ──────────────────────────────────────── */}
        <section>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">Galeri Desa</h2>
              <p className="text-gray-500 text-sm mt-1">Dokumentasi foto dan video kegiatan desa.</p>
            </div>
            <Link
              href="/informasi/galeri"
              className="text-blue-600 text-sm font-semibold hover:underline flex items-center gap-1"
            >
              Lihat Semua <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {galeriList.length === 0 ? (
            <div className="text-center py-10 text-gray-400 bg-white rounded-2xl border border-gray-100">
              <Images className="w-10 h-10 mx-auto mb-3 opacity-30" />
              <p className="text-sm">Belum ada foto yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {galeriList.map((item) => (
                <Link
                  key={item.id}
                  href={`/informasi/galeri/${item.id}`}
                  className="group bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md hover:border-purple-100 transition-all"
                >
                  <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={item.image_url || "/bg.jpg"}
                      alt={item.judul}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div className="absolute top-3 left-3 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full flex items-center gap-1">
                      <Images className="w-2.5 h-2.5" /> FOTO
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                      <span className="inline-flex items-center gap-2 bg-white/90 backdrop-blur-sm text-purple-700 font-semibold text-sm px-4 py-2 rounded-full shadow-md">
                        Lihat Foto <ArrowRight className="w-4 h-4" />
                      </span>
                    </div>
                  </div>
                  <div className="p-5 flex-1 flex flex-col">
                    <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
                      <Calendar className="w-3 h-3" />
                      {formatDate(item.tanggal_kegiatan ?? item.created_at)}
                    </div>
                    <h3 className="font-bold text-purple-700 text-lg leading-snug mb-1 line-clamp-2 group-hover:text-purple-800 transition-colors">
                      {item.judul}
                    </h3>
                    {item.konten && (
                      <p className="text-gray-400 text-xs line-clamp-2">{item.konten}</p>
                    )}
                  </div>
                </Link>
              ))}
            </div>
          )}
        </section>

      </div>
    </div>
  );
}
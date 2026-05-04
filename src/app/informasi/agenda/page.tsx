import Image from "next/image";
import Link from "next/link";
import { Clock, MapPin, CalendarDays, ArrowRight, Megaphone } from "lucide-react";
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

// ─── Helpers ───────────────────────────────────────────────────────────────────
function getDateParts(dateString: string | null): {
  day: string;
  month: string;
  year: string;
  dayName: string;
} {
  if (!dateString) return { day: "-", month: "-", year: "-", dayName: "-" };
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString("id-ID", { day: "2-digit" }),
    month: date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
    year: date.getFullYear().toString(),
    dayName: date.toLocaleDateString("id-ID", { weekday: "long" }),
  };
}

function truncate(text: string, maxLength = 120): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
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
export default async function AgendaPage() {
  const supabase = await createClient();

  const { data: agendaList, error } = await supabase
    .from("informasi_dusun")
    .select("id, judul, konten, penulis, tanggal_kegiatan, lokasi, created_at, kategori, image_url")
    .eq("kategori", "agenda")
    .order("tanggal_kegiatan", { ascending: true });

  if (error) {
    console.error("Error fetching agenda:", error.message);
  }

  const items: InformasiDesa[] = agendaList ?? [];

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/agenda-kegiatan.webp"
          alt="Agenda Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <CalendarDays className="w-3.5 h-3.5" />
            Agenda Kegiatan
          </div>
          <h1 className="text-4xl font-bold mb-2">Agenda Kegiatan</h1>
          <p className="text-lg text-gray-200">
            Jadwal kegiatan dan acara yang akan datang di dusun.
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
              <BreadcrumbPage>Agenda</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20">
        {/* Empty State */}
        {items.length === 0 && (
          <div className="text-center py-20 text-gray-400">
            <CalendarDays className="w-12 h-12 mx-auto mb-4 opacity-40" />
            <p className="text-lg font-medium">Belum ada agenda yang dipublikasikan.</p>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {items.map((item) => {
            const { day, month, dayName } = getDateParts(item.tanggal_kegiatan);
            const status = getStatus(item.tanggal_kegiatan);

            return (
              <div
                key={item.id}
                className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow"
              >
                {/* Date Header */}
                <div className="bg-[#108c64] text-white p-5 flex justify-between items-start">
                  <div>
                    <span className="text-3xl font-bold leading-none block">{day}</span>
                    <span className="text-[10px] font-bold uppercase tracking-wider block mt-1 text-green-100">
                      {month}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[10px] text-green-200 uppercase tracking-widest block mb-1 font-semibold">
                      HARI
                    </span>
                    <span className="font-bold text-lg leading-none">{dayName}</span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <div className="space-y-3 mb-5 border-b border-gray-100 pb-5">
                    {/* Lokasi */}
                    <div className="flex gap-3 items-start">
                      <MapPin className="w-4 h-4 text-red-500 mt-0.5 shrink-0" />
                      <div>
                        <span className="block text-xs text-gray-400 uppercase tracking-wider font-bold mb-0.5">
                          LOKASI
                        </span>
                        <span className="block text-sm font-semibold text-gray-800">
                          {item.lokasi ?? "Belum ditentukan"}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="mb-2">
                    <span className="inline-flex items-center gap-1 bg-[#108c64] text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      <CalendarDays className="w-2.5 h-2.5" />
                      Agenda
                    </span>
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-2">
                    {item.judul}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 mb-6">
                    {truncate(item.konten)}
                  </p>

                  <div className="mt-auto flex items-center justify-between">
                    <span
                      className={`text-xs font-bold px-3 py-1.5 rounded-full flex items-center w-fit gap-1.5 ${statusStyle[status]}`}
                    >
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
      </div>
    </div>
  );
}

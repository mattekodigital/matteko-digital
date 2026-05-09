import type { Metadata } from "next";
import Image from "next/image";
import { UsersRound, Earth, BookOpen, MapPin, Mail, Phone } from "lucide-react";
import { getProfilDusun } from "@/lib/data/profil";
import { getLatestInfoWilayah } from "@/lib/data/statistik";
import type { InfoWilayah } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";


export const metadata: Metadata = {
  title: 'Profil & Identitas Dusun',
  description: 'Profil lengkap Dusun Matteko — sejarah dusun, dan informasi kontak pemerintahan dusun.',
  openGraph: {
    title: 'Profil & Identitas Dusun Matteko',
    description: 'Profil lengkap Dusun Matteko — sejarah dusun, dan informasi kontak pemerintahan dusun.',
  },
};

export const dynamic = "force-dynamic";

export default async function ProfilPage() {
  const [profil, wilayah] = await Promise.all([
    getProfilDusun(),
    getLatestInfoWilayah(),
  ]);
  const wilayahRingkas = wilayah as Pick<InfoWilayah, "total_penduduk" | "luas_wilayah"> | null;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">

      {/* Hero Section */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/hero-dusun.webp"
          alt="Background Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <BookOpen className="w-3.5 h-3.5" />
            Profil Resmi
          </div>
          <h1 className="text-4xl font-bold mb-2">Profil &amp; Identitas</h1>
          <p className="text-lg text-gray-300">Mengenal lebih dalam {profil?.nama_dusun || "Dusun Matteko"}.</p>
        </div>
      </div>

      {/* Breadcrumb */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 mb-6">
        <Breadcrumb>
          <BreadcrumbList>
            <BreadcrumbItem>
              <BreadcrumbLink href="/">Beranda</BreadcrumbLink>
            </BreadcrumbItem>
            <BreadcrumbSeparator />
            <BreadcrumbItem>
              <BreadcrumbPage>Profil Dusun</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      {/* Stats Cards */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 mb-6">
        <div className="flex flex-wrap gap-4">
          {/* Penduduk — biru */}
          <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl p-5 text-white w-36 sm:w-44 shadow-xl hover:shadow-blue-400/40 hover:-translate-y-0.5 transition-all duration-300">
            <UsersRound className="w-6 h-6 mb-2 opacity-90" />
            <p className="text-3xl font-bold leading-tight">
              {wilayahRingkas?.total_penduduk
                ? wilayahRingkas.total_penduduk.toLocaleString("id-ID")
                : "—"}
            </p>
            <p className="text-sm mt-1 opacity-90">Penduduk</p>
          </div>
          {/* Luas Wilayah — hijau */}
          <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-xl p-5 text-white w-36 sm:w-44 shadow-xl hover:shadow-green-400/40 hover:-translate-y-0.5 transition-all duration-300">
            <Earth className="w-6 h-6 mb-2 opacity-90" />
            <p className="text-3xl font-bold leading-tight">
              {wilayahRingkas?.luas_wilayah
                ? Number(wilayahRingkas.luas_wilayah).toLocaleString("id-ID", { maximumFractionDigits: 2 })
                : "—"}
            </p>
            <p className="text-sm mt-1 opacity-90">Ha Luas</p>
          </div>
        </div>
      </div>

      {/* Main Content: two-column on lg, single column on mobile */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
        <div className="flex flex-col lg:flex-row gap-6 items-start">

          {/* LEFT: main content */}
          <div className="flex-1 w-full space-y-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-blue-100 rounded-md p-2">
                  <BookOpen className="w-5 h-5 text-blue-800" />
                </div>
                <h2 className="font-semibold text-gray-800 text-lg">Sejarah Dusun</h2>
              </div>
              <div className="text-gray-600 text-sm leading-relaxed space-y-3 whitespace-pre-wrap text-justify">
                {profil?.sejarah_dusun || "Informasi sejarah dusun belum tersedia."}
              </div>
            </div>
          </div>

          {/* RIGHT: sidebar — sticky on lg, flows normally on mobile */}
          <div className="w-full lg:w-72 lg:flex-shrink-0">
            <div className="lg:sticky lg:top-6 space-y-4">

              {/* Info Card */}
              <div className="bg-white rounded-xl shadow-sm p-5">
                <div className="h-2 -mx-5 -mt-5 mb-5 rounded-t-xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500" />

                <div className="flex flex-col items-center text-center mb-5">
                  <div className="w-20 h-20 relative mb-3">
                    <Image
                      src={profil?.url_logo || "/logo.webp"}
                      alt={`Logo ${profil?.nama_dusun || 'Dusun'}`}
                      fill
                      sizes="80px"
                      className="object-contain"
                    />
                  </div>
                  <h3 className="font-bold text-gray-800 text-lg leading-tight">{profil?.nama_dusun || "Dusun Matteko"}</h3>
                  <p className="text-xs text-gray-500 uppercase tracking-widest mt-0.5">Pemerintah Dusun</p>
                </div>

                <div className="space-y-3 text-sm text-gray-600">
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <MapPin className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-0.5">Alamat Kantor</p>
                      <p className="leading-snug">{profil?.alamat_kantor || "-"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <Mail className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-0.5">Email Resmi</p>
                      <p>{profil?.email || "-"}</p>
                    </div>
                  </div>
                  <div className="flex gap-3">
                    <div className="w-7 h-7 bg-gray-100 rounded-md flex items-center justify-center flex-shrink-0">
                      <Phone className="w-4 h-4 text-gray-500" />
                    </div>
                    <div>
                      <p className="text-xs text-gray-400 uppercase font-medium mb-0.5">Telepon / WhatsApp</p>
                      <p>{profil?.no_telepon || "-"}</p>
                    </div>
                  </div>
                </div>
              </div>


            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

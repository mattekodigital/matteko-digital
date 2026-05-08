"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Building,
  HeartHandshake,
  Zap,
  UserRound,
  Calendar,
  ArrowRight,
  MapPin,
  Newspaper,
  Leaf,
  ChevronRight,
  Star,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { InformasiDesa, ProfilDusun } from "@/lib/types";

interface HomeClientProps {
  profil: ProfilDusun | null;
  beritaList: InformasiDesa[];
  potensiList: InformasiDesa[];
}

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

function truncate(text: string, maxLength = 110): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

const CATEGORY_COLORS: Record<string, string> = {
  wisata: "bg-emerald-500",
  umkm: "bg-amber-500",
  pertanian: "bg-lime-600",
};
const CATEGORY_LABELS: Record<string, string> = {
  wisata: "Wisata",
  umkm: "UMKM",
  pertanian: "Pertanian",
};

function useFadeIn() {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.12 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return { ref, visible };
}

function SectionHeader({
  eyebrow,
  title,
  href,
  linkLabel = "Lihat Semua",
  ariaLabel,
  dark = false,
}: {
  eyebrow: string;
  title: string;
  href: string;
  linkLabel?: string;
  ariaLabel?: string;
  dark?: boolean;
}) {
  return (
    <div className="flex items-end justify-between mb-10">
      <div>
        <p className={cn("text-xs font-bold uppercase tracking-widest mb-2",
          dark ? "text-blue-400" : "text-amber-500")}>{eyebrow}</p>
        <h2 className={cn("text-2xl sm:text-3xl font-bold",
          dark ? "text-white" : "text-gray-800")}>{title}</h2>
      </div>
      <Link
        href={href}
        aria-label={ariaLabel || linkLabel}
        className={cn(
          "hidden sm:flex items-center gap-1.5 text-sm font-semibold transition-colors duration-200 group",
          dark ? "text-blue-400 hover:text-blue-300" : "text-amber-500 hover:text-amber-600"
        )}
      >
        {linkLabel}
        <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
      </Link>
    </div>
  );
}

function BeritaCard({ item, index }: { item: InformasiDesa; index: number }) {
  const { ref, visible } = useFadeIn();

  return (
    <div
      ref={ref}
      className={cn(
        "bg-[#162032] rounded-2xl overflow-hidden border border-white/5 flex flex-col",
        "transition-all duration-500 hover:border-blue-500/40 hover:shadow-2xl hover:shadow-blue-900/20 hover:-translate-y-1",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative h-48 w-full overflow-hidden">
        <Image
          src={item.image_url || "/bg.jpg"}
          alt={item.judul}
          fill
          className="object-cover transition-transform duration-700 group-hover:scale-110"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-[#0d1b2e]/60 to-transparent" />
        <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-600 text-white text-[10px] font-bold uppercase border-0 shadow-md">
          {item.kategori}
        </Badge>
      </div>

      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center text-xs text-gray-400 mb-3 gap-2">
          <Calendar className="w-3 h-3 shrink-0" />
          {formatDate(item.tanggal_kegiatan ?? item.created_at)}
        </div>
        <h3 className="font-bold text-white text-base leading-snug mb-2 line-clamp-2">
          {item.judul}
        </h3>
        <p className="text-gray-400 text-sm line-clamp-3 mb-4 flex-1">
          {truncate(item.konten)}
        </p>
          <Link
            href={`/informasi/berita/${item.id}`}
            aria-label={`Baca selengkapnya: ${item.judul}`}
            className="text-blue-400 font-semibold text-sm flex items-center gap-1 hover:text-blue-300 transition-colors group w-fit mt-auto"
          >
            Baca Selengkapnya
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
      </div>
    </div>
  );
}

function PotensiCard({ item, index }: { item: InformasiDesa; index: number }) {
  const { ref, visible } = useFadeIn();
  const badgeColor = CATEGORY_COLORS[item.kategori] ?? "bg-gray-400";
  const categoryLabel = CATEGORY_LABELS[item.kategori] ?? item.kategori;

  return (
    <div
      ref={ref}
      className={cn(
        "bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col",
        "transition-all duration-500 hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-200",
        visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
      )}
      style={{ transitionDelay: `${index * 80}ms` }}
    >
      <div className="relative h-55 w-full bg-gray-200 overflow-hidden">
        <Image
          src={item.image_url || "/bg.jpg"}
          alt={item.judul}
          fill
          className="object-cover transition-transform duration-700 hover:scale-105"
          sizes="(max-width: 768px) 100vw, 33vw"
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/30 to-transparent" />
        <span className={cn(
          "absolute top-4 left-4 text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-md",
          badgeColor
        )}>
          {categoryLabel}
        </span>
      </div>

      <div className="p-6 flex-1 flex flex-col">
        {item.lokasi && (
          <div className="flex items-center gap-1 text-xs text-gray-400 mb-2">
            <MapPin className="w-3 h-3 shrink-0" />
            {item.lokasi}
          </div>
        )}
        <h3 className="font-bold text-gray-800 text-lg leading-snug mb-3">
          {item.judul}
        </h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-6 flex-1">
          {truncate(item.konten)}
        </p>
        <div className="mt-auto pt-5 border-t border-gray-100">
          <Link
            href={`/potensi/${item.id}`}
            aria-label={`Lihat detail: ${item.judul}`}
            className="text-amber-500 font-bold text-sm flex items-center gap-1 hover:text-amber-600 transition-colors group w-fit"
          >
            Lihat Detail
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-200 group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </div>
  );
}

function StatCard({
  icon: Icon,
  label,
  desc,
  colorClass,
  href,
}: {
  icon: React.ElementType;
  label: string;
  desc: string;
  colorClass: string;
  href: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white shadow-lg rounded-2xl p-6 flex flex-col gap-3 transition-all duration-300 hover:shadow-xl hover:-translate-y-1 active:scale-95 group"
    >
      <div className={cn("w-10 h-10 rounded-xl flex items-center justify-center", colorClass)}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h4 className="font-bold text-gray-800 text-sm mb-0.5 group-hover:text-blue-700 transition-colors">{label}</h4>
        <p className="text-gray-500 text-xs leading-relaxed">{desc}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all mt-auto self-end" />
    </Link>
  );
}

export default function HomeClient({ profil, beritaList, potensiList }: HomeClientProps) {
  const { ref: heroRef, visible: heroVisible } = useFadeIn();
  const { ref: sambutanRef, visible: sambutanVisible } = useFadeIn();

  return (
    <>
      <section className="relative min-h-svh pb-20 overflow-hidden">
        <div className="absolute inset-0 h-[600px] -z-10">
          <Image
            src="/hero-dusun.webp"
            alt="Latar belakang Dusun Matteko"
            fill
            className="object-cover"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-linear-to-b from-black/60 via-black/40 to-black/70" />
        </div>

        <div
          ref={heroRef}
          className={cn(
            "relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 pt-28 sm:pt-36 transition-all duration-700",
            heroVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="inline-flex items-center gap-2 bg-blue-500/30 backdrop-blur-sm border border-blue-400/30 text-blue-200 text-xs font-semibold px-4 py-1.5 rounded-full mb-6 uppercase tracking-widest">
            <Star className="w-3 h-3 fill-blue-300 text-blue-300" />
            Website Resmi Pemerintahan
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold text-white mb-4 leading-tight max-w-2xl">
            Selamat Datang di{" "}
            <span className="bg-linear-to-r from-blue-300 to-teal-400 bg-clip-text text-transparent">
              {profil?.nama_dusun || "Dusun Matteko"}
            </span>
          </h1>

          <p className="text-base sm:text-lg text-white/80 max-w-xl mb-8 leading-relaxed">
            Melayani masyarakat dengan transparansi, inovasi, dan gotong royong untuk mewujudkan dusun yang maju dan sejahtera.
          </p>

          <div className="flex flex-wrap gap-3 mb-14">
            <Button
              asChild
              className="bg-blue-600 hover:bg-blue-500 active:scale-95 text-white font-semibold rounded-full px-6 py-5 shadow-lg shadow-blue-900/40 transition-all duration-200"
            >
              <Link href="/informasi/berita">
                <Newspaper className="w-4 h-4 mr-2" />
                Jelajahi Berita
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="bg-white/10 border-white/30 hover:bg-white/20 active:scale-95 text-white font-semibold rounded-full px-6 py-5 backdrop-blur-sm transition-all duration-200"
            >
              <Link href="/profil">
                Profil Dusun
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={HeartHandshake}
              label="Pelayanan"
              desc="Layanan administrasi cepat, mudah, dan gratis"
              colorClass="bg-green-100 text-green-700"
              href="/kontak"
            />

            <StatCard
              icon={Zap}
              label="Pemberdayaan"
              desc="Mendukung UMKM dan potensi wisata lokal"
              colorClass="bg-yellow-100 text-yellow-700"
              href="/potensi"
            />

            <StatCard
              icon={Building}
              label="Transparansi"
              desc="Informasi publik, berita, dan agenda kegiatan dusun"
              colorClass="bg-blue-100 text-blue-700"
              href="/informasi"
            />
          </div>
        </div>

        <div
          ref={sambutanRef}
          className={cn(
            "relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 mt-20 sm:mt-28",
            "flex flex-col md:flex-row gap-10 md:gap-16 items-center",
            "transition-all duration-700 delay-200",
            sambutanVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="relative w-56 h-56 sm:w-72 sm:h-72 shrink-0 mx-auto md:mx-0">
            <div className="absolute inset-0 bg-teal-400/30 rounded-3xl rotate-6 translate-x-3 translate-y-3 blur-sm" />
            <div className="absolute inset-0 bg-blue-400/20 rounded-3xl -rotate-3 -translate-x-2 translate-y-1" />
            <div className="relative h-full rounded-3xl overflow-hidden border-4 border-white/20 shadow-2xl">
              {profil?.foto_kepala_dusun ? (
                <Image
                  src={profil.foto_kepala_dusun}
                  alt={profil.nama_kepala_dusun || "Kepala Dusun"}
                  fill
                  className="object-cover"
                  sizes="(max-width: 640px) 224px, 288px"
                />
              ) : (
                <div className="w-full h-full bg-white/10 backdrop-blur-sm flex items-center justify-center">
                  <UserRound className="w-24 h-24 text-white/40" />
                </div>
              )}
            </div>
          </div>

          <div className="flex flex-col flex-1 text-center md:text-left">
            <span className="inline-block bg-blue-500/20 border border-blue-400/30 text-blue-800 text-xs font-bold px-3 py-1 rounded-full uppercase tracking-widest mb-4 w-fit mx-auto md:mx-0">
              Sambutan Kepala Dusun
            </span>
            <h2 className="text-xl sm:text-4xl font-bold text-black mb-5 leading-tight">
              Bersinergi Membangun{" "} <br />
              <span className="bg-linear-to-r from-blue-300 to-teal-400 bg-clip-text text-transparent">
                Dusun Berkemajuan
              </span>
            </h2>
            <blockquote className="bg-white/5 border-l-4 border-blue-400 pl-5 pr-4 py-4 rounded-r-xl text-black/80 text-sm italic leading-relaxed mb-6">
              "{profil?.pesan_sambutan || "Website ini merupakan wujud komitmen kami dalam mewujudkan pemerintahan yang transparan, akuntabel, dan inovatif demi kesejahteraan masyarakat."}"
            </blockquote>
            <div className="flex items-center gap-3 self-center md:self-start">
              {profil?.foto_kepala_dusun ? (
                <div className="relative w-10 h-10 rounded-lg overflow-hidden border-2 border-white/30">
                  <Image
                    src={profil.foto_kepala_dusun}
                    alt={profil.nama_kepala_dusun || "Kepala Dusun"}
                    fill
                    className="object-cover"
                    sizes="40px"
                  />
                </div>
              ) : (
                <div className="w-10 h-10 rounded-lg bg-blue-500/30 flex items-center justify-center border border-blue-400/30">
                  <UserRound className="w-5 h-5 text-blue-200" />
                </div>
              )}
              <div>
                <p className="font-bold text-black text-sm">{profil?.nama_kepala_dusun || "Kepala Dusun"}</p>
                <p className="text-black/60 text-xs">Kepala {profil?.nama_dusun || "Dusun Matteko"}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="bg-[#0d1b2e] py-16 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Kabar Desa"
            title="Berita Terbaru"
            href="/informasi/berita"
            ariaLabel="Lihat semua berita dusun"
            dark
          />

          {beritaList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-600 gap-3">
              <Newspaper className="w-12 h-12 opacity-30" />
              <p className="text-sm">Belum ada berita yang dipublikasikan.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {beritaList.map((item, index) => (
                <BeritaCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}

          <div className="mt-8 flex sm:hidden justify-center">
            <Button asChild variant="outline" className="border-blue-500/40 text-blue-400 hover:bg-blue-900/30 rounded-full">
              <Link href="/informasi/berita" aria-label="Lihat semua berita dusun">
                Semua Berita <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      <section className="bg-gray-50 py-16 sm:py-24">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <SectionHeader
            eyebrow="Kekayaan Lokal"
            title="Jelajahi Potensi Dusun"
            href="/potensi"
            ariaLabel="Lihat semua potensi dusun"
          />

          {potensiList.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-gray-400 gap-3">
              <Leaf className="w-12 h-12 opacity-30" />
              <p className="text-sm">Belum ada data potensi yang tersedia.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {potensiList.map((item, index) => (
                <PotensiCard key={item.id} item={item} index={index} />
              ))}
            </div>
          )}

          <div className="mt-8 flex sm:hidden justify-center">
            <Button asChild variant="outline" className="border-amber-400 text-amber-600 hover:bg-amber-50 rounded-full">
              <Link href="/potensi" aria-label="Lihat semua potensi dusun">
                Semua Potensi <ArrowRight className="w-4 h-4 ml-2" aria-hidden="true" />
              </Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import {
  Map,
  Users,
  Home,
  Building2,
  Briefcase,
  GraduationCap,
  Users2,
  Flame,
  BarChart3,
} from "lucide-react";
import { getAllDataStatistik, getLatestInfoWilayah } from "@/lib/data/statistik";
import type { DataStatistik } from "@/lib/types";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const metadata: Metadata = {
  title: 'Data & Statistik Dusun',
  description: 'Data statistik penduduk Dusun Matteko — demografi, mata pencaharian, agama, gender, dan tingkat pendidikan masyarakat.',
  openGraph: {
    title: 'Data & Statistik Dusun Matteko',
    description: 'Data statistik penduduk Dusun Matteko — demografi, mata pencaharian, agama, gender, dan tingkat pendidikan.',
  },
};


const AGAMA_COLORS = [
  "#10b981",
  "#8b5cf6",
  "#f59e0b",
  "#ef4444",
  "#06b6d4",
  "#ec4899",
];

function buildConicGradient(items: DataStatistik[]): string {
  const total = items.reduce((s, i) => s + i.nilai, 0);
  if (total === 0) return "#e5e7eb";
  let cumulative = 0;
  const stops = items.map((item, idx) => {
    const start = (cumulative / total) * 100;
    cumulative += item.nilai;
    const end = (cumulative / total) * 100;
    return `${AGAMA_COLORS[idx % AGAMA_COLORS.length]} ${start.toFixed(1)}% ${end.toFixed(1)}%`;
  });
  return `conic-gradient(${stops.join(", ")})`;
}

export const dynamic = "force-dynamic";

export default async function StatistikPage() {
  const [wilayah, statistik] = await Promise.all([
    getLatestInfoWilayah(),
    getAllDataStatistik(),
  ]);

  const pekerjaan = statistik.filter((s) => s.kategori === "pekerjaan");
  const agama = statistik.filter((s) => s.kategori === "agama");
  const gender = statistik.filter((s) => s.kategori === "gender");
  const pendidikan = statistik.filter((s) => s.kategori === "pendidikan");

  const maxPekerjaan = Math.max(...pekerjaan.map((d) => d.nilai), 1);
  const maxPendidikan = Math.max(...pendidikan.map((d) => d.nilai), 1);
  const totalGender = gender.reduce((s, d) => s + d.nilai, 0);

  const laki = gender.find(
    (g) => g.label.toLowerCase().includes("laki") || g.label === "L"
  );
  const lakiPct = totalGender > 0 ? ((laki?.nilai ?? 0) / totalGender) * 100 : 50;
  const perempuanPct = 100 - lakiPct;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero */}
      <div className="relative h-72 w-full overflow-hidden">
        <Image
          src="/statistik-layout.webp"
          alt="Statistik Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <BarChart3 className="w-3.5 h-3.5" />
            Data Statistik
          </div>
          <h1 className="text-4xl font-bold mb-2">Data &amp; Statistik</h1>
          <p className="text-lg text-gray-200">
            Informasi demografi dan statistik penduduk dusun.
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
              <BreadcrumbPage>Statistik Dusun</BreadcrumbPage>
            </BreadcrumbItem>
          </BreadcrumbList>
        </Breadcrumb>
      </div>

      <div className="max-w-6xl mx-auto px-6 pb-20 space-y-10">

        {/* ── GAMBARAN UMUM WILAYAH ── */}
        <section>
          <div className="flex items-center gap-2 mb-6 border-l-4 border-blue-800 pl-3">
            <h2 className="text-xl font-bold text-gray-800 uppercase tracking-wide">
              Gambaran Umum Wilayah
            </h2>
          </div>

          {wilayah ? (
            <>
              {/* Stats Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
                <StatCard
                  label="Luas Wilayah"
                  value={`${wilayah.luas_wilayah.toLocaleString("id-ID")}`}
                  unit="Ha"
                  icon={<Map className="w-5 h-5 text-blue-600" />}
                  bg="bg-blue-100"
                />
                <StatCard
                  label="Total Penduduk"
                  value={wilayah.total_penduduk.toLocaleString("id-ID")}
                  unit="Jiwa"
                  icon={<Users className="w-5 h-5 text-green-600" />}
                  bg="bg-green-100"
                />
                <StatCard
                  label="Kepala Keluarga"
                  value={wilayah.total_kk.toLocaleString("id-ID")}
                  unit="KK"
                  icon={<Home className="w-5 h-5 text-orange-600" />}
                  bg="bg-orange-100"
                />
                <StatCard
                  label="Kepadatan"
                  value={
                    wilayah.kepadatan > 0
                      ? wilayah.kepadatan.toLocaleString("id-ID")
                      : "—"
                  }
                  unit={wilayah.kepadatan > 0 || (wilayah.luas_wilayah > 0 && wilayah.total_penduduk > 0) ? "Jiwa/km²" : ""}
                  icon={<Building2 className="w-5 h-5 text-purple-600" />}
                  bg="bg-purple-100"
                />
              </div>

              {/* Border Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[
                  { dir: "U", label: "Sebelah Utara", val: wilayah.batas_utara },
                  { dir: "S", label: "Sebelah Selatan", val: wilayah.batas_selatan },
                  { dir: "T", label: "Sebelah Timur", val: wilayah.batas_timur },
                  { dir: "B", label: "Sebelah Barat", val: wilayah.batas_barat },
                ].map((b) => (
                  <div
                    key={b.dir}
                    className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4 hover:-translate-y-0.5 hover:shadow-md hover:border-gray-200 transition-all duration-300"
                  >
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center font-bold text-gray-600 flex-shrink-0">
                      {b.dir}
                    </div>
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-0.5">
                        {b.label}
                      </p>
                      <p className="text-sm font-semibold text-gray-800">
                        {b.val ?? "-"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <EmptyState message="Data wilayah belum tersedia." />
          )}
        </section>

        {/* ── STATISTIK: PEKERJAAN · AGAMA · GENDER · PENDIDIKAN ── */}
        {(pekerjaan.length > 0 || agama.length > 0 || gender.length > 0 || pendidikan.length > 0) && (
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Mata Pencaharian (bar chart) — only shown if data exists */}
          {pekerjaan.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-yellow-50 flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">
                  Mata Pencaharian
                </h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  Profesi utama penduduk
                </p>
              </div>
            </div>
            <div className="h-64 flex items-end justify-between gap-2 mt-auto px-2 relative">
              <div className="absolute left-0 top-0 bottom-8 flex flex-col justify-between text-[10px] text-gray-400 w-8">
                {[maxPekerjaan, Math.round(maxPekerjaan * 0.66), Math.round(maxPekerjaan * 0.33), 0].map(
                  (v) => (
                    <span key={v}>{v.toLocaleString("id-ID")}</span>
                  )
                )}
              </div>
              <div className="ml-8 flex-1 flex items-end justify-between gap-2 h-full pb-8 relative border-b border-gray-100">
                {pekerjaan.map((d, i) => (
                  <div key={i} className="flex flex-col items-center flex-1 h-full justify-end group">
                    <div className="relative w-full" style={{ height: `${(d.nilai / maxPekerjaan) * 100}%` }}>
                      <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-[10px] font-semibold px-2 py-0.5 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-150 whitespace-nowrap z-10 pointer-events-none">
                        {d.nilai.toLocaleString("id-ID")}
                      </span>
                      <div className="w-full h-full bg-[#fbbf24] rounded-t-sm group-hover:bg-yellow-400 group-hover:shadow-sm transition-all" />
                    </div>
                    <span className="absolute bottom-1 text-[9px] text-gray-500 -rotate-[25deg] origin-top-left transform translate-y-3 translate-x-2 group-hover:text-gray-800 whitespace-nowrap">
                      {d.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Agama */}
          {agama.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-purple-50 flex items-center justify-center">
                <Flame className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">Agama Penduduk</h3>
                <p className="text-xs text-gray-500 mt-0.5">Komposisi pemeluk agama</p>
              </div>
            </div>
            {agama.length === 1 ? (
              <div className="flex-1 flex flex-col items-center justify-center gap-4 py-6">
                <div className="w-36 h-36 rounded-full flex items-center justify-center" style={{ background: AGAMA_COLORS[0] }}>
                  <span className="text-white font-bold text-2xl">100%</span>
                </div>
                <p className="text-gray-700 font-semibold text-lg">{agama[0].label}</p>
                <p className="text-gray-400 text-sm">{agama[0].nilai.toLocaleString("id-ID")} jiwa · seluruh penduduk</p>
              </div>
            ) : (
              <div className="flex-1 flex flex-col justify-center items-center gap-8 py-4">
                <div className="w-48 h-48 rounded-full" style={{ background: buildConicGradient(agama) }} />
                <div className="w-full space-y-3 mt-4">
                  {agama.map((d, i) => (
                    <div key={i} className="flex justify-between items-center text-sm hover:bg-purple-50 rounded-lg px-2 -mx-2 py-1.5 transition-colors duration-150 cursor-default group">
                      <div className="flex items-center gap-2">
                        <span className="w-3 h-3 rounded-sm flex-shrink-0" style={{ backgroundColor: AGAMA_COLORS[i % AGAMA_COLORS.length] }} />
                        <span className="text-gray-600 group-hover:text-gray-800">{d.label}</span>
                      </div>
                      <span className="font-semibold text-gray-800 group-hover:text-purple-700 transition-colors">{d.nilai.toLocaleString("id-ID")}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          )}

          {/* Gender (donut) */}
          {gender.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center">
                <Users2 className="w-5 h-5 text-pink-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">Demografi Gender</h3>
                <p className="text-xs text-gray-500 mt-0.5">Perbandingan Laki-laki &amp; Perempuan</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col items-center justify-center gap-10 py-6">
              <div
                className="relative w-48 h-48 rounded-full flex items-center justify-center"
                style={{ background: `conic-gradient(#ec4899 0% ${perempuanPct.toFixed(1)}%, #3b82f6 ${perempuanPct.toFixed(1)}% 100%)` }}
              >
                <div className="w-24 h-24 bg-white rounded-full flex flex-col items-center justify-center">
                  <span className="text-xs text-gray-400">Total</span>
                  <span className="font-bold text-gray-800 text-lg">{totalGender.toLocaleString("id-ID")}</span>
                </div>
              </div>
              <div className="w-full space-y-3">
                {gender.map((d, i) => (
                  <div key={i} className="flex justify-between items-center text-sm hover:bg-pink-50 rounded-lg px-2 -mx-2 py-1.5 transition-colors duration-150 cursor-default group">
                    <div className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-full flex-shrink-0" style={{ backgroundColor: d.label.toLowerCase().includes("perempuan") || d.label === "P" ? "#ec4899" : "#3b82f6" }} />
                      <span className="text-gray-600 group-hover:text-gray-800">{d.label}</span>
                    </div>
                    <span className="font-semibold text-gray-800 group-hover:text-pink-600 transition-colors">
                      {d.nilai.toLocaleString("id-ID")}
                      <span className="text-xs text-gray-400 ml-1">({totalGender > 0 ? ((d.nilai / totalGender) * 100).toFixed(1) : 0}%)</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
          )}

          {/* Pendidikan — only shown if data exists */}
          {pendidikan.length > 0 && (
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col">
            <div className="flex items-center gap-3 mb-8">
              <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center">
                <GraduationCap className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <h3 className="font-bold text-gray-800 text-lg leading-tight">Tingkat Pendidikan</h3>
                <p className="text-xs text-gray-500 mt-0.5">Jenjang pendidikan penduduk</p>
              </div>
            </div>
            <div className="flex-1 flex flex-col justify-end space-y-4 relative pb-6">
              {pendidikan.map((d, i) => (
                <div key={i} className="flex items-center gap-3 text-xs group hover:bg-blue-50 rounded-lg px-2 -mx-2 py-1 transition-colors duration-150">
                  <div className="w-28 text-right text-gray-600 shrink-0 group-hover:font-semibold group-hover:text-gray-800 transition-all">{d.label}</div>
                  <div className="flex-1">
                    <div className="h-6 bg-[#60a5fa] rounded-r-md group-hover:bg-blue-500 group-hover:shadow-sm transition-all" style={{ width: `${(d.nilai / maxPendidikan) * 100}%` }} />
                  </div>
                  <span className="text-gray-500 w-10 text-right shrink-0 group-hover:font-bold group-hover:text-blue-600 transition-all">{d.nilai.toLocaleString("id-ID")}</span>
                </div>
              ))}
              <div className="absolute bottom-0 left-32 right-10 flex border-t border-gray-100 text-[10px] text-gray-400 justify-between pt-1">
                <span>0</span>
                <span>{Math.round(maxPendidikan * 0.25).toLocaleString("id-ID")}</span>
                <span>{Math.round(maxPendidikan * 0.5).toLocaleString("id-ID")}</span>
                <span>{Math.round(maxPendidikan * 0.75).toLocaleString("id-ID")}</span>
                <span>{maxPendidikan.toLocaleString("id-ID")}</span>
              </div>
            </div>
          </div>
          )}

        </section>
        )}
      </div>
    </div>
  );
}

// ─── Sub-components ───────────────────────────────────────────────────────────
function StatCard({
  label,
  value,
  unit,
  icon,
  bg,
}: {
  label: string;
  value: string;
  unit: string;
  icon: React.ReactNode;
  bg: string;
}) {
  return (
    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between hover:-translate-y-1 hover:shadow-md hover:border-gray-200 transition-all duration-300 cursor-default">
      <div>
        <p className="text-xs text-gray-400 font-bold uppercase mb-1">{label}</p>
        <p className="text-2xl font-bold text-gray-800">
          {value}{" "}
          <span className="text-sm font-normal text-gray-500">{unit}</span>
        </p>
      </div>
      <div
        className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center flex-shrink-0`}
      >
        {icon}
      </div>
    </div>
  );
}

function EmptyState({ message }: { message: string }) {
  return (
    <div className="flex-1 flex items-center justify-center text-gray-400 text-sm py-8">
      {message}
    </div>
  );
}

"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import type { InformasiDesa } from "@/lib/types";

// Label mapping untuk kategori
const CATEGORY_LABELS: Record<string, string> = {
  wisata: "Wisata",
  umkm: "UMKM",
  pertanian: "Pertanian",
};

// Warna badge per kategori
const CATEGORY_COLORS: Record<string, string> = {
  wisata: "bg-emerald-500",
  umkm: "bg-[#f4a100]",
  pertanian: "bg-lime-600",
};

const FILTER_OPTIONS = [
  { value: "semua", label: "Semua" },
  { value: "wisata", label: "Wisata" },
  { value: "umkm", label: "UMKM" },
  { value: "pertanian", label: "Pertanian" },
];

interface Props {
  items: InformasiDesa[];
}

export default function PotensiClientFilter({ items }: Props) {
  const [activeCategory, setActiveCategory] = useState("semua");

  const filteredData =
    activeCategory === "semua"
      ? items
      : items.filter((item) => item.kategori === activeCategory);

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-3 mb-10">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => setActiveCategory(opt.value)}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all shadow-sm ${
              activeCategory === opt.value
                ? "bg-[#f4a100] text-white"
                : "bg-white text-gray-600 border border-gray-100 hover:border-gray-300"
            }`}
          >
            {opt.label}
          </button>
        ))}
      </div>

      {/* Cards Grid */}
      {filteredData.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {filteredData.map((item) => {
            const badgeColor = CATEGORY_COLORS[item.kategori] ?? "bg-gray-400";
            const categoryLabel = CATEGORY_LABELS[item.kategori] ?? item.kategori;
            const excerpt = item.konten?.slice(0, 120) ?? "";

            return (
              <div
                key={item.id}
                className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-200 transition-all duration-300 group"
              >
                {/* Thumbnail */}
                <div className="relative h-[220px] w-full bg-gray-200 overflow-hidden">
                  <Image
                    src={item.image_url || "/bg.jpg"}
                    alt={item.judul}
                    fill
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  <div
                    className={`absolute top-4 left-4 ${badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}
                  >
                    {categoryLabel}
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold text-gray-800 text-lg leading-snug mb-3 group-hover:text-amber-600 transition-colors duration-200">
                    {item.judul}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                    {excerpt}
                    {item.konten?.length > 120 ? "..." : ""}
                  </p>

                  <div className="mt-auto pt-5 border-t border-gray-100">
                    <Link
                      href={`/potensi/${item.id}`}
                      className="text-[#f4a100] font-bold text-sm flex items-center gap-1 hover:text-[#d98f00] transition-colors group/link"
                    >
                      Lihat Detail
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover/link:translate-x-1" />
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-12 text-gray-400">
          <p className="text-lg font-medium mb-1">Belum ada data potensi</p>
          <p className="text-sm">
            {activeCategory === "semua"
              ? "Data potensi belum tersedia."
              : `Tidak ada data untuk kategori "${CATEGORY_LABELS[activeCategory] ?? activeCategory}".`}
          </p>
        </div>
      )}
    </>
  );
}

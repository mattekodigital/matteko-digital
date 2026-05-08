"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowRight } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { InformasiDesa } from "@/lib/types";

const PAGE_SIZE = 12;

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
  const [currentPage, setCurrentPage] = useState(1);

  const filteredData =
    activeCategory === "semua"
      ? items
      : items.filter((item) => item.kategori === activeCategory);

  const totalPages = Math.ceil(filteredData.length / PAGE_SIZE);
  const paginated = filteredData.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE
  );

  const getPageNumbers = () => {
    const pages: (number | "ellipsis")[] = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      pages.push(1);
      if (currentPage > 3) pages.push("ellipsis");
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);
      for (let i = start; i <= end; i++) pages.push(i);
      if (currentPage < totalPages - 2) pages.push("ellipsis");
      pages.push(totalPages);
    }
    return pages;
  };

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
    setCurrentPage(1); // reset ke halaman 1 saat filter berubah
  };

  const handlePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      {/* Filter Tabs */}
      <div className="flex justify-center flex-wrap gap-3 mb-10">
        {FILTER_OPTIONS.map((opt) => (
          <button
            key={opt.value}
            onClick={() => handleCategoryChange(opt.value)}
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
        <>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
            {paginated.map((item) => {
              const badgeColor = CATEGORY_COLORS[item.kategori] ?? "bg-gray-400";
              const categoryLabel = CATEGORY_LABELS[item.kategori] ?? item.kategori;
              const excerpt = item.konten?.slice(0, 120) ?? "";

              return (
                <Link
                  key={item.id}
                  href={`/potensi/${item.id}`}
                  className="bg-white rounded-[24px] shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-xl hover:-translate-y-1.5 hover:border-amber-200 transition-all duration-300 group cursor-pointer"
                >
                  <div className="relative h-[220px] w-full bg-gray-200 overflow-hidden">
                    <Image
                      src={item.image_url || "/bg.jpg"}
                      alt={item.judul}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                      sizes="(max-width: 768px) 100vw, 33vw"
                    />
                    <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    <div
                      className={`absolute top-4 left-4 ${badgeColor} text-white text-[10px] font-bold px-3 py-1.5 rounded-full uppercase tracking-wider shadow-sm`}
                    >
                      {categoryLabel}
                    </div>
                  </div>

                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="font-bold text-gray-800 text-lg leading-snug mb-3 group-hover:text-amber-600 transition-colors duration-200">
                      {item.judul}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-6">
                      {excerpt}
                      {item.konten?.length > 120 ? "..." : ""}
                    </p>

                    <div className="mt-auto pt-5 border-t border-gray-100 flex items-center gap-1 text-[#f4a100] font-bold text-sm">
                      Lihat Detail
                      <ArrowRight className="w-4 h-4 transition-transform duration-200 group-hover:translate-x-1" />
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) handlePage(currentPage - 1);
                    }}
                    aria-disabled={currentPage === 1}
                    className={currentPage === 1 ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>

                {getPageNumbers().map((page, idx) =>
                  page === "ellipsis" ? (
                    <PaginationItem key={`ellipsis-${idx}`}>
                      <PaginationEllipsis />
                    </PaginationItem>
                  ) : (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        isActive={page === currentPage}
                        onClick={(e) => {
                          e.preventDefault();
                          handlePage(page as number);
                        }}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) handlePage(currentPage + 1);
                    }}
                    aria-disabled={currentPage === totalPages}
                    className={currentPage === totalPages ? "pointer-events-none opacity-50" : ""}
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
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

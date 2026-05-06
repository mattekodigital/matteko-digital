"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calendar, MapPin, Images } from "lucide-react";
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

function formatDate(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

function truncate(text: string, maxLength = 80): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-purple-50 flex items-center justify-center mb-5 border border-purple-100">
        <Images className="w-9 h-9 text-purple-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Foto</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Dokumentasi foto kegiatan dusun akan ditampilkan di sini.
      </p>
    </div>
  );
}

interface Props {
  items: InformasiDesa[];
}

export default function GaleriGrid({ items }: Props) {
  const [currentPage, setCurrentPage] = useState(1);

  const totalPages = Math.ceil(items.length / PAGE_SIZE);
  const paginated = items.slice(
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

  const handlePage = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  if (items.length === 0) return <EmptyState />;

  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 mb-10">
        {paginated.map((item) => (
          <Link
            key={item.id}
            href={`/informasi/galeri/${item.id}`}
            className="group relative bg-white rounded-2xl overflow-hidden shadow-sm border border-gray-100 hover:shadow-xl hover:border-purple-100 transition-all duration-300 flex flex-col"
          >
            <div className="relative w-full aspect-[4/3] overflow-hidden bg-gray-100">
              <Image
                src={item.image_url || "/bg.jpg"}
                alt={item.judul}
                fill
                className="object-cover transition-transform duration-500 group-hover:scale-110"
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 bg-purple-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  <Images className="w-2.5 h-2.5" />
                  Galeri
                </span>
              </div>
            </div>

            <div className="p-4 flex flex-col gap-1.5">
              <h3 className="font-bold text-gray-800 text-base leading-snug line-clamp-2 group-hover:text-purple-700 transition-colors">
                {item.judul}
              </h3>

              <div className="flex flex-wrap items-center gap-3 text-xs text-gray-400 mt-0.5">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3 shrink-0" />
                  {formatDate(item.tanggal_kegiatan ?? item.created_at)}
                </span>
                {item.lokasi && (
                  <span className="flex items-center gap-1 truncate max-w-[140px]">
                    <MapPin className="w-3 h-3 shrink-0" />
                    {item.lokasi}
                  </span>
                )}
              </div>

              {item.konten && (
                <p className="text-gray-400 text-xs leading-relaxed mt-1 line-clamp-2">
                  {truncate(item.konten)}
                </p>
              )}
            </div>
          </Link>
        ))}
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
  );
}

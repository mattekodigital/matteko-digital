"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { Calendar, User, ArrowRight, Megaphone, Newspaper } from "lucide-react";
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

function truncate(text: string, maxLength = 150): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "...";
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-blue-50 flex items-center justify-center mb-5 border border-blue-100">
        <Newspaper className="w-9 h-9 text-blue-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Berita</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Berita dan artikel terbaru seputar dusun akan ditampilkan di sini.
      </p>
    </div>
  );
}

interface Props {
  items: InformasiDesa[];
}

export default function BeritaGrid({ items }: Props) {
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
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        {paginated.map((item) => (
          <Link
            key={item.id}
            href={`/informasi/berita/${item.id}`}
            className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow group cursor-pointer"
          >
            <div className="relative h-48 w-full bg-gray-200 overflow-hidden">
              <Image
                src={item.image_url || "/bg.jpg"}
                alt={item.judul}
                fill
                className="object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute top-3 left-3">
                <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                  <Megaphone className="w-2.5 h-2.5" />
                  {item.kategori}
                </span>
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
                {truncate(item.konten)}
              </p>

              <div className="mt-auto text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:underline">
                Baca Selengkapnya <ArrowRight className="w-4 h-4" />
              </div>
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

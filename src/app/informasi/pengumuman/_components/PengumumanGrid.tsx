"use client";

import Link from "next/link";
import { useState } from "react";
import { ArrowRight, Clock, Image as ImageIcon, Megaphone } from "lucide-react";
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

function getDay(dateString: string | null): string {
  if (!dateString) return "--";
  return new Date(dateString).getDate().toString().padStart(2, "0");
}

function getMonth(dateString: string | null): string {
  if (!dateString) return "---";
  return new Date(dateString).toLocaleDateString("id-ID", { month: "short" });
}

function getYear(dateString: string | null): string {
  if (!dateString) return "----";
  return new Date(dateString).getFullYear().toString();
}

function formatRelative(dateString: string | null): string {
  if (!dateString) return "-";
  return new Date(dateString).toLocaleDateString("id-ID", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

interface Props {
  items: InformasiDesa[];
}

export default function PengumumanGrid({ items }: Props) {
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

  return (
    <>
      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 text-gray-400">
          <Megaphone className="w-12 h-12 mb-4 opacity-30" />
          <p className="text-lg font-medium">Belum ada pengumuman.</p>
        </div>
      ) : (
        <>
          <div className="flex flex-col gap-4 mb-10">
            {paginated.map((item) => {
              const displayDate = item.tanggal_kegiatan ?? item.created_at;
              return (
                <Link
                  key={item.id}
                  href={`/informasi/pengumuman/${item.id}`}
                  className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex gap-5 items-start hover:shadow-md transition-shadow group cursor-pointer"
                >
                  <div className="bg-blue-50 border border-blue-100 rounded-xl p-4 flex flex-col items-center justify-center min-w-[80px] text-blue-600 flex-shrink-0">
                    <span className="text-2xl font-bold leading-none">
                      {getDay(displayDate)}
                    </span>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-center leading-tight mt-1 text-blue-400">
                      {getMonth(displayDate)}
                      <br />
                      {getYear(displayDate)}
                    </span>
                  </div>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center text-xs text-gray-400 mb-2 gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelative(displayDate)}
                    </div>
                    <div className="mb-2">
                      <span className="inline-flex items-center gap-1 bg-blue-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                        <Megaphone className="w-2.5 h-2.5" />
                        Pengumuman
                      </span>
                    </div>
                    <h3 className="font-bold text-blue-700 text-lg leading-snug mb-2 line-clamp-2">
                      {item.judul}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 mb-3">
                      {item.konten.slice(0, 160)}...
                    </p>

                    {item.image_url && (
                      <div className="flex items-center gap-2 bg-yellow-50 text-yellow-800 text-xs px-3 py-2 rounded-lg w-fit mb-3 border border-yellow-200">
                        <ImageIcon className="w-4 h-4 text-yellow-500" />
                        Ada lampiran gambar
                      </div>
                    )}

                    <span className="text-blue-600 font-semibold text-sm flex items-center gap-1 group-hover:underline w-fit">
                      Baca Detail Pengumuman <ArrowRight className="w-4 h-4" />
                    </span>
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
      )}
    </>
  );
}

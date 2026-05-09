"use client";

import Link from "next/link";
import { useState } from "react";
import { MapPin, CalendarDays, ArrowRight } from "lucide-react";
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

function getDateParts(dateString: string | null): {
  day: string;
  month: string;
  dayName: string;
} {
  if (!dateString) return { day: "-", month: "-", dayName: "-" };
  const date = new Date(dateString);
  return {
    day: date.toLocaleDateString("id-ID", { day: "2-digit" }),
    month: date.toLocaleDateString("id-ID", { month: "long", year: "numeric" }),
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
  Berlangsung: "bg-blue-50 text-blue-600",
  Selesai: "bg-gray-100 text-gray-500",
};

const statusDot: Record<string, string> = {
  "Akan Datang": "bg-[#108c64]",
  Berlangsung: "bg-blue-500",
  Selesai: "bg-gray-400",
};

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-28 text-center px-4">
      <div className="w-20 h-20 rounded-full bg-green-50 flex items-center justify-center mb-5 border border-green-100">
        <CalendarDays className="w-9 h-9 text-green-300" />
      </div>
      <h3 className="text-lg font-semibold text-gray-600 mb-1">Belum Ada Agenda</h3>
      <p className="text-sm text-gray-400 max-w-xs">
        Jadwal kegiatan dan acara mendatang di dusun akan ditampilkan di sini.
      </p>
    </div>
  );
}

interface Props {
  items: InformasiDesa[];
}

export default function AgendaGrid({ items }: Props) {
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
        {paginated.map((item) => {
          const { day, month, dayName } = getDateParts(item.tanggal_kegiatan);
          const status = getStatus(item.tanggal_kegiatan);

          return (
            <Link
              key={item.id}
              href={`/informasi/agenda/${item.id}`}
              className="bg-white rounded-2xl shadow-sm overflow-hidden border border-gray-100 flex flex-col hover:shadow-md transition-shadow group cursor-pointer"
            >
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

              <div className="p-6 flex-1 flex flex-col">
                <div className="space-y-3 mb-5 border-b border-gray-100 pb-5">
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

                  <span className="text-[#108c64] font-semibold text-sm flex items-center gap-1 group-hover:underline">
                    Selengkapnya <ArrowRight className="w-4 h-4" />
                  </span>
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
  );
}

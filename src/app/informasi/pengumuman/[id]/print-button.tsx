"use client";

import { Printer } from "lucide-react";

export function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-blue-600 border border-gray-200 hover:border-blue-300 px-4 py-2 rounded-lg transition-all"
      aria-label="Cetak pengumuman"
    >
      <Printer className="w-4 h-4" />
      Cetak
    </button>
  );
}

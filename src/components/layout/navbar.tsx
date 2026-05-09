"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import Image from "next/image";
import { Menu, X, ChevronDown, Phone, Mail } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger, SheetClose } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { ProfilDusun } from "@/lib/types";

interface NavItem {
  label: string;
  href?: string;
  children?: { label: string; href: string }[];
}

const NAV_ITEMS: NavItem[] = [
  { label: "Profil", href: "/profil" },
  {
    label: "Informasi",
    children: [
      { label: "Berita Dusun", href: "/informasi/berita" },
      { label: "Pengumuman", href: "/informasi/pengumuman" },
      { label: "Agenda Kegiatan", href: "/informasi/agenda" },
      { label: "Galeri Foto", href: "/informasi/galeri" },
    ],
  },
  { label: "Statistik", href: "/statistik" },
  { label: "Potensi", href: "/potensi" },
  { label: "Kontak", href: "/kontak" },
];

function DesktopDropdown({ item, pathname }: { item: NavItem; pathname: string }) {
  const [open, setOpen] = useState(false);
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href));

  return (
    <div
      className="relative"
      onMouseEnter={() => setOpen(true)}
      onMouseLeave={() => setOpen(false)}
    >
      <button
        className={cn(
          "flex items-center gap-1 text-sm font-medium px-4 py-2 rounded-full transition-all duration-200",
          isChildActive
            ? "text-blue-600 font-semibold"
            : "text-black hover:text-blue-600 hover:bg-blue-50"
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("w-3.5 h-3.5 transition-transform duration-200", open && "rotate-180")}
        />
      </button>

      <div
        className={cn(
          "absolute top-full left-0 mt-1 w-52 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden",
          "transition-all duration-200 origin-top-left",
          open ? "opacity-100 scale-100 pointer-events-auto" : "opacity-0 scale-95 pointer-events-none"
        )}
      >
        {item.children!.map((child) => (
          <Link
            key={child.href}
            href={child.href}
            className={cn(
              "block px-4 py-2.5 text-sm transition-colors duration-150",
              pathname.startsWith(child.href)
                ? "bg-blue-50 text-blue-600 font-semibold"
                : "text-black hover:bg-gray-50 hover:text-blue-600"
            )}
          >
            {child.label}
          </Link>
        ))}
      </div>
    </div>
  );
}

function MobileNavItem({ item, pathname, onClose }: { item: NavItem; pathname: string; onClose: () => void }) {
  const [open, setOpen] = useState(false);
  const isChildActive = item.children?.some((c) => pathname.startsWith(c.href));

  if (item.href) {
    const isActive = pathname === item.href || pathname.startsWith(item.href + "/");
    return (
      <SheetClose asChild>
        <Link
          href={item.href}
          className={cn(
            "block px-4 py-3 rounded-full text-sm font-medium transition-colors",
            isActive
              ? "bg-blue-50 text-blue-600 font-semibold"
              : "text-black hover:bg-gray-50"
          )}
        >
          {item.label}
        </Link>
      </SheetClose>
    );
  }

  return (
    <div>
      <button
        onClick={() => setOpen(!open)}
        className={cn(
          "w-full flex items-center justify-between px-4 py-3 rounded-full text-sm font-medium transition-colors",
          isChildActive ? "text-blue-600" : "text-black hover:bg-gray-50"
        )}
      >
        {item.label}
        <ChevronDown
          className={cn("w-4 h-4 transition-transform duration-200", open && "rotate-180")}
        />
      </button>
      {open && (
        <div className="pl-4 pb-1 space-y-0.5">
          {item.children!.map((child) => (
            <SheetClose key={child.href} asChild>
              <Link
                href={child.href}
                className={cn(
                  "block px-4 py-2.5 rounded-full text-sm transition-colors",
                  pathname.startsWith(child.href)
                    ? "text-blue-600 font-semibold bg-blue-50"
                    : "text-black hover:text-blue-600 hover:bg-gray-50"
                )}
              >
                {child.label}
              </Link>
            </SheetClose>
          ))}
        </div>
      )}
    </div>
  );
}

export const Navbar = ({ profil }: { profil?: ProfilDusun }) => {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <nav
      className=
        "sticky top-0 z-50 w-full transition-all duration-300 bg-white/20 backdrop-blur-md border-b border-white/20"
    >
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">

        <Link href="/" className="flex items-center gap-3 shrink-0 group">
          <div className="relative w-10 h-10 overflow-hidden rounded-full transition-transform duration-300 group-hover:scale-110">
            <Image
              src={profil?.url_logo || "/logo.webp"}
              alt={`Logo ${profil?.nama_dusun || "Dusun"}`}
              fill
              className="object-contain"
              sizes="40px"
            />
          </div>
          <div className="flex flex-col leading-tight">
            <span className={cn(
              "font-bold text-base transition-colors duration-300 text-black",
            )}>
              {profil?.nama_dusun || "Dusun Matteko"}
            </span>
            <span className={cn(
              "text-[10px] uppercase tracking-widest font-medium transition-colors duration-300 text-black/60",
            )}>
              {profil?.nama_kabupaten ? `Kab. ${profil.nama_kabupaten}` : "Kab. Gowa"}
            </span>
          </div>
        </Link>

        <div className="hidden lg:flex items-center gap-1 px-1.5 py-1 bg-gray-50/50 border border-gray-200/50 rounded-full shadow-sm backdrop-blur-sm">
          {NAV_ITEMS.map((item) =>
            item.children ? (
              <DesktopDropdown key={item.label} item={item} pathname={pathname} />
            ) : (
              <Link
                key={item.label}
                href={item.href!}
                className={cn(
                  "text-sm font-medium px-4 py-2 rounded-full transition-all duration-200 text-black hover:text-blue-600 hover:bg-blue-50",
                  pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href!))
                    ? "text-blue-600 font-semibold"
                    : ""
                )}
              >
                {item.label}
              </Link>
            )
          )}
        </div>

        <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
          <SheetTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="lg:hidden h-9 w-9 text-black hover:bg-gray-100 transition-colors"
              aria-label="Buka menu navigasi"
            >
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>

          <SheetContent side="right" showCloseButton={false} className="w-[300px] sm:w-[360px] p-0 bg-white">
            <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
              <Link
                href="/"
                onClick={() => setMobileOpen(false)}
                className="flex items-center gap-2.5 min-w-0"
              >
                <div className="relative w-8 h-8 shrink-0">
                  <Image
                    src={profil?.url_logo || "/logo.webp"}
                    alt="Logo"
                    fill
                    className="object-contain"
                    sizes="32px"
                  />
                </div>
                <span className="font-bold text-gray-900 text-sm truncate">
                  {profil?.nama_dusun || "Dusun Matteko"}
                </span>
              </Link>
              <SheetClose asChild>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  className="shrink-0 ml-2 text-gray-500 hover:text-gray-900 hover:bg-gray-100"
                  aria-label="Tutup menu"
                >
                  <X className="h-4 w-4" />
                </Button>
              </SheetClose>
            </div>

            <div className="overflow-y-auto h-full pb-24 px-3 py-3 space-y-1">
              {NAV_ITEMS.map((item) => (
                <MobileNavItem
                  key={item.label}
                  item={item}
                  pathname={pathname}
                  onClose={() => setMobileOpen(false)}
                />
              ))}

              <div className="pt-4 px-1 space-y-2 border-t border-gray-100 mt-4">
                {profil?.no_telepon && (
                  <a
                    href={`tel:${profil.no_telepon}`}
                    className="flex items-center gap-3 text-sm text-black hover:text-blue-600 py-2 px-3"
                  >
                    <Phone className="w-4 h-4 text-blue-500" />
                    {profil.no_telepon}
                  </a>
                )}
                {profil?.email && (
                  <a
                    href={`mailto:${profil.email}`}
                    className="flex items-center gap-3 text-sm text-black hover:text-blue-600 py-2 px-3"
                  >
                    <Mail className="w-4 h-4 text-blue-500" />
                    {profil.email}
                  </a>
                )}
              </div>
            </div>
          </SheetContent>
        </Sheet>

      </div>
    </nav>
  );
};
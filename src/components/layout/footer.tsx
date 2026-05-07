"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { MapPin, Phone, Mail, Link2, Map } from "lucide-react";
import type { ProfilDusun } from "@/lib/types";

export default function Footer({ profil }: { profil?: ProfilDusun }) {
  const [mapLoaded, setMapLoaded] = useState(false);
  return (
    <footer className="bg-linear-to-r from-blue-950 to-blue-900 text-white pt-12 pb-8">
      
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="relative w-10 h-10 shrink-0">
              <Image
                src={profil?.url_logo || "/logo.webp"}
                alt={`Logo ${profil?.nama_dusun || 'Dusun'}`}
                fill
                className="object-contain"
                sizes="40px"
              />
            </div>
            <div>
              <p className="font-semibold text-sm">{profil?.nama_dusun || "Dusun Matteko"}</p>
              <p className="text-xs text-blue-200">Kabupaten {profil?.nama_kabupaten || "Gowa"}</p>
            </div>
          </div>

          <p className="text-sm text-blue-200 leading-relaxed mb-4">
            {profil?.visi || "Mewujudkan tata kelola pemerintahan dusun yang transparan, akuntabel, partisipatif, dan inovatif demi kesejahteraan masyarakat."}
          </p>

          <div className="flex gap-3">
            {profil?.link_facebook && (
              <a href={profil.link_facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" aria-label="Facebook Dusun Matteko">
                <Link2 className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
            {profil?.link_instagram && (
              <a href={profil.link_instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" aria-label="Instagram Dusun Matteko">
                <Link2 className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
            {profil?.link_youtube && (
              <a href={profil.link_youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" aria-label="YouTube Dusun Matteko">
                <Link2 className="w-5 h-5" aria-hidden="true" />
              </a>
            )}
          </div>
        </div>

        <div>
          <p className="font-semibold mb-4 border-l-2 border-blue-400 pl-2">
            Jelajahi
          </p>
          <ul className="space-y-2 text-sm text-blue-200">
            <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
            <li><Link href="/profil" className="hover:text-white transition-colors">Profil Dusun</Link></li>
            <li><Link href="/informasi/berita" className="hover:text-white transition-colors">Berita Terbaru</Link></li>
            <li><Link href="/potensi" className="hover:text-white transition-colors">Potensi Wisata</Link></li>
            <li><Link href="/statistik" className="hover:text-white transition-colors">Data &amp; Statistik</Link></li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4 border-l-2 border-green-400 pl-2">
            Kontak Kami
          </p>
          <ul className="space-y-3 text-sm text-blue-200">
            <li className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 transition-colors duration-200 shrink-0">
                <MapPin size={14} />
              </span>
              <span className="line-clamp-2">{profil?.alamat_kantor || "Dusun Matteko, Kabupaten Gowa, Sulawesi Selatan"}</span>
            </li>
            <li className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 transition-colors duration-200 shrink-0">
                <Phone size={14} />
              </span>
              {profil?.no_telepon || "0812345789"}
            </li>
            <li className="flex items-center gap-2">
              <span className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/10 hover:bg-white/25 transition-colors duration-200 shrink-0">
                <Mail size={14} />
              </span>
              {profil?.email || "matteko.digital@gmail.com"}
            </li>
          </ul>
        </div>

        <div>
          <p className="font-semibold mb-4 border-l-2 border-orange-400 pl-2">
            Lokasi
          </p>
          {mapLoaded ? (
            <iframe
              src="https://www.google.com/maps/embed?pb=!1m17!1m12!1m3!1d997.4!2d119.887147!3d-5.180142!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m2!1m1!2zNcKwMTAnNDguNSJTIDExOcKwNTMnMTMuNyJF!5e0!3m2!1sid!2sid!4v1"
              className="w-full h-32 rounded-lg border-0"
              loading="lazy"
              title="Lokasi Kantor Dusun"
              referrerPolicy="no-referrer-when-downgrade"
            />
          ) : (
            <button
              onClick={() => setMapLoaded(true)}
              className="w-full h-32 rounded-lg bg-blue-800/40 border border-blue-700/30 flex flex-col items-center justify-center gap-2 hover:bg-blue-800/60 transition-colors cursor-pointer group"
              aria-label="Muat peta lokasi kantor dusun"
            >
              <Map className="w-6 h-6 text-blue-300 group-hover:text-white transition-colors" aria-hidden="true" />
              <span className="text-xs text-blue-300 group-hover:text-white transition-colors font-medium">Klik untuk muat peta</span>
            </button>
          )}
        </div>

      </div>

      <div className="text-center text-xs text-blue-300 mt-10">
        © {new Date().getFullYear()} {profil?.nama_dusun || "Dusun Matteko"}. All rights reserved.
      </div>

    </footer>
  );
}
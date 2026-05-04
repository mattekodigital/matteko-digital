import Link from "next/link";
import { MapPin, Phone, Mail, Link2 } from "lucide-react";
import type { ProfilDusun } from "@/lib/types";

export default function Footer({ profil }: { profil?: ProfilDusun }) {
  return (
    <footer className="bg-linear-to-r from-blue-950 to-blue-900 text-white pt-12 pb-8">
      
      <div className="max-w-6xl mx-auto px-6 grid md:grid-cols-4 gap-10">

        <div>
          <div className="flex items-center gap-3 mb-4">
            <img src={profil?.url_logo || "/logo.png"} alt={`Logo ${profil?.nama_dusun || 'Dusun'}`} className="w-10 h-10 object-contain" />
            <div>
              <h3 className="font-semibold">{profil?.nama_dusun || "Dusun Matteko"}</h3>
              <p className="text-xs text-blue-200">Kabupaten {profil?.nama_kabupaten || "Gowa"}</p>
            </div>
          </div>

          <p className="text-sm text-blue-200 leading-relaxed mb-4">
            {profil?.visi || "Mewujudkan tata kelola pemerintahan dusun yang transparan, akuntabel, partisipatif, dan inovatif demi kesejahteraan masyarakat."}
          </p>

          <div className="flex gap-3">
            {profil?.link_facebook && (
              <a href={profil.link_facebook} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Facebook">
                <Link2 className="w-5 h-5" />
              </a>
            )}
            {profil?.link_instagram && (
              <a href={profil.link_instagram} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="Instagram">
                <Link2 className="w-5 h-5" />
              </a>
            )}
            {profil?.link_youtube && (
              <a href={profil.link_youtube} target="_blank" rel="noopener noreferrer" className="p-2 bg-white/10 rounded-full hover:bg-white/20 transition-colors" title="YouTube">
                <Link2 className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-semibold mb-4 border-l-2 border-blue-400 pl-2">
            Jelajahi
          </h4>
          {/* Fixed: was using <li> with cursor-pointer (breaks keyboard nav & accessibility) */}
          <ul className="space-y-2 text-sm text-blue-200">
            <li><Link href="/" className="hover:text-white transition-colors">Beranda</Link></li>
            <li><Link href="/profil" className="hover:text-white transition-colors">Profil Dusun</Link></li>
            <li><Link href="/informasi/berita" className="hover:text-white transition-colors">Berita Terbaru</Link></li>
            <li><Link href="/potensi" className="hover:text-white transition-colors">Potensi Wisata</Link></li>
            <li><Link href="/statistik" className="hover:text-white transition-colors">Data &amp; Statistik</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-semibold mb-4 border-l-2 border-green-400 pl-2">
            Kontak Kami
          </h4>
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
          <h4 className="font-semibold mb-4 border-l-2 border-orange-400 pl-2">
            Lokasi
          </h4>
          <iframe
            src="https://maps.google.com/maps?q=-5.180142,119.887147&t=&z=13&ie=UTF8&iwloc=&output=embed"
            className="w-full h-32 rounded-lg border-0"
            loading="lazy"
            title="Lokasi Kantor Dusun"
          ></iframe>
        </div>

      </div>

      <div className="text-center text-xs text-blue-300 mt-10">
        © {new Date().getFullYear()} {profil?.nama_dusun || "Dusun Matteko"}. All rights reserved.
      </div>

    </footer>
  );
}
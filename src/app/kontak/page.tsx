import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { MapPin, Phone, Clock, MessageCircle } from "lucide-react";
import { getProfilDusun } from "@/lib/data/profil";

export const metadata: Metadata = {
  title: 'Kontak & Lokasi',
  description: 'Informasi kontak, alamat kantor, dan lokasi pusat pelayanan Dusun Matteko.',
  openGraph: {
    title: 'Kontak Dusun Matteko',
    description: 'Hubungi kami — alamat, telepon, dan informasi layanan Dusun Matteko.',
  },
};

export const revalidate = 3600;

export default async function KontakPage() {
  const profil = await getProfilDusun();

  const alamat = profil?.alamat_kantor || "-";
  const telepon = profil?.no_telepon || "-";
  const email = profil?.email || "-";
  const namaDusun = profil?.nama_dusun || "Dusun Matteko";

  const waLink = telepon !== "-"
    ? `https://wa.me/${telepon.replace(/[^0-9]/g, "").replace(/^0/, "62")}`
    : "#";

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      {/* Hero Section */}
      <div className="relative h-80 w-full overflow-hidden">
        <Image
          src="/kontak-kantor.webp"
          alt="Kontak Dusun"
          fill
          className="object-cover brightness-50"
          priority
        />
        <div className="absolute inset-0 bg-linear-to-t from-black/80 via-black/40 to-transparent"></div>
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white text-center px-4">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-4 py-1.5 rounded-full text-xs font-medium uppercase tracking-widest mb-4">
            <Phone className="w-3.5 h-3.5" />
            Hubungi Kami
          </div>
          <h1 className="text-4xl font-bold mb-2">Hubungi Kami</h1>
          <p className="text-lg text-gray-200">Informasi kontak dan lokasi pusat pelayanan dusun.</p>
        </div>
      </div>

      {/* Info Cards (Overlapping Hero) */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 relative z-10 -mt-16 mb-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Card 1: Alamat Kantor */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-blue-50 rounded-full flex items-center justify-center mb-5">
              <MapPin className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Alamat Kantor</h3>
            <p className="text-sm text-gray-500">{alamat}</p>
          </div>

          {/* Card 2: Kontak Resmi */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-green-50 rounded-full flex items-center justify-center mb-5">
              <Phone className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Kontak Resmi</h3>
            <p className="text-sm text-gray-500 mb-1">
              Telepon / WhatsApp:<br/>
              {telepon !== "-" ? (
                <a href={`tel:${telepon}`} className="text-blue-600 hover:underline font-medium">{telepon}</a>
              ) : <span>-</span>}
            </p>
            <p className="text-sm text-gray-500">
              Email:<br/>
              {email !== "-" ? (
                <a href={`mailto:${email}`} className="text-blue-600 hover:underline font-medium">{email}</a>
              ) : <span>-</span>}
            </p>
          </div>

          {/* Card 3: Jam Pelayanan */}
          <div className="bg-white rounded-2xl shadow-md border border-gray-100 p-8 flex flex-col items-center text-center hover:shadow-lg transition-shadow">
            <div className="w-14 h-14 bg-orange-50 rounded-full flex items-center justify-center mb-5">
              <Clock className="w-6 h-6 text-pink-500" />
            </div>
            <h3 className="text-lg font-bold text-gray-800 mb-2">Jam Pelayanan</h3>
            <p className="text-sm text-gray-500 space-y-1">
              <span className="block">Senin - Kamis: 08.00 - 14.00</span>
              <span className="block">Jumat: 08.00 - 11.00</span>
              <span className="block">Sabtu - Minggu: Libur</span>
            </p>
          </div>

        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          
          {/* Left: Map */}
          <div className="w-full h-[400px] bg-white p-2 rounded-3xl shadow-sm border border-gray-100">
             <iframe 
                src="https://maps.google.com/maps?q=-5.180142,119.887147&t=&z=15&ie=UTF8&iwloc=&output=embed" 
                width="100%" 
                height="100%" 
                style={{ border: 0, borderRadius: '1.25rem' }} 
                allowFullScreen={true} 
                loading="lazy" 
                referrerPolicy="no-referrer-when-downgrade"
             ></iframe>
          </div>

          {/* Right: Text & Buttons */}
          <div className="space-y-6">
            <div>
              <p className="text-sm font-bold text-blue-600 uppercase tracking-widest mb-2">Lokasi Kami</p>
              <h2 className="text-3xl font-bold text-gray-800 leading-tight">Berkunjung ke {namaDusun}</h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              {namaDusun} menyambut baik kedatangan Anda untuk bersilaturahmi, berkolaborasi, maupun berdiskusi seputar potensi dan perkembangan dusun kami.
            </p>

            {alamat !== "-" && (
              <div className="flex items-start gap-3 bg-gray-50 rounded-xl p-4 border border-gray-100">
                <MapPin className="w-5 h-5 text-pink-500 mt-0.5 shrink-0" />
                <p className="text-sm text-gray-600">{alamat}</p>
              </div>
            )}

            <div className="flex flex-wrap gap-4 pt-2">
              <Link href="https://goo.gl/maps/18cKTyMjjH6621z89" target="_blank" rel="noopener noreferrer" className="bg-slate-900 text-white font-semibold py-3 px-6 rounded-xl hover:bg-slate-800 transition-colors shadow-sm text-sm">
                Buka di Google Maps
              </Link>
              {telepon !== "-" && (
                <Link href={waLink} target="_blank" rel="noopener noreferrer" className="bg-green-100 text-green-700 font-semibold py-3 px-6 rounded-xl hover:bg-green-200 transition-colors shadow-sm text-sm flex items-center gap-2">
                  <MessageCircle className="w-4 h-4" />
                  Chat WhatsApp
                </Link>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
// Tipe database untuk tabel informasi_dusun
export interface InformasiDesa {
  id: string;
  kategori: "berita" | "pengumuman" | "agenda" | "galeri" | "wisata" | "umkm" | "pertanian";
  judul: string;
  konten: string;
  image_url: string | null;
  penulis: string | null;
  tanggal_kegiatan: string | null;
  lokasi: string | null;
  created_at: string;
}

// Tipe database untuk tabel profil_dusun
export interface ProfilDusun {
  id: string;
  nama_dusun: string;
  nama_desa: string;
  nama_kecamatan: string;
  nama_kabupaten: string;
  nama_provinsi: string;
  kode_pos: string | null;
  nama_kepala_dusun: string;
  foto_kepala_dusun: string | null;
  pesan_sambutan: string | null;
  sejarah_dusun: string | null;
  visi: string | null;
  misi: string | null;
  email: string | null;
  no_telepon: string | null;
  alamat_kantor: string | null;
  link_facebook: string | null;
  link_instagram: string | null;
  link_youtube: string | null;
  url_logo: string | null;
  url_banner: string | null;
  created_at: string;
  updated_at: string;
}

// Tipe untuk tabel info_wilayah
export interface InfoWilayah {
  id: number;
  luas_wilayah: number;
  total_penduduk: number;
  total_kk: number;
  kepadatan: number;
  batas_utara: string | null;
  batas_selatan: string | null;
  batas_timur: string | null;
  batas_barat: string | null;
  updated_at: string;
}

// Tipe untuk tabel data_statistik
export interface DataStatistik {
  id: number;
  kategori: "pekerjaan" | "agama" | "gender" | "pendidikan";
  label: string;
  nilai: number;
  urutan: number;
}

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('Missing DATABASE_URL');
  process.exit(1);
}

const categories = ['galeri'];
const imageUrl = '/informasi.webp';

function generateData(category, count) {
  const data = [];
  for (let i = 1; i <= count; i++) {
    data.push({
      kategori: category,
      judul: `Contoh ${category.charAt(0).toUpperCase() + category.slice(1)} Ke-${i}`,
      konten: `Ini adalah deskripsi atau konten panjang untuk ${category} ke-${i}. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.`,
      image_url: imageUrl,
      penulis: 'Admin Dusun',
      tanggal_kegiatan: new Date(
        Date.now() + (Math.random() * 60 - 30) * 24 * 60 * 60 * 1000
      ).toISOString(),
      lokasi:
        category === 'wisata' || category === 'umkm' || category === 'pertanian'
          ? 'Dusun Matteko'
          : 'Balai Dusun',
    });
  }
  return data;
}

async function seed() {
  const { Pool } = await import('pg');
  const pool = new Pool({ connectionString });

  console.log('Mulai proses seeding...');

  try {
    for (const category of categories) {
      console.log(`Seeding ${category}...`);
      const records = generateData(category, 20);

      for (const record of records) {
        await pool.query(
          `INSERT INTO informasi_dusun
            (kategori, judul, konten, image_url, penulis, tanggal_kegiatan, lokasi)
           VALUES ($1, $2, $3, $4, $5, $6, $7)`,
          [
            record.kategori,
            record.judul,
            record.konten,
            record.image_url,
            record.penulis,
            record.tanggal_kegiatan,
            record.lokasi,
          ]
        );
      }
      console.log(`Berhasil menambahkan 20 data untuk ${category}`);
    }

    console.log('Seeding selesai!');
  } finally {
    await pool.end();
  }
}

seed()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  });

import type { Metadata } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { TooltipProvider } from "@/components/ui/tooltip";
import ConditionalLayout from "@/components/layout/conditional-layout";
import { getProfilDusun } from "@/lib/data/profil";


const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
});

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: {
    template: '%s | Dusun Matteko Digital',
    default: 'Dusun Matteko Digital - Website Resmi Dusun Matteko',
  },
  description: 'Website resmi Dusun Matteko, Kabupaten Gowa, Sulawesi Selatan. Informasi pemerintahan, berita terbaru, statistik penduduk, dan potensi dusun.',
  keywords: ['Dusun Matteko', 'Dusun Matteko', 'Kabupaten Gowa', 'Sulawesi Selatan', 'Pemerintahan Dusun', 'Website Dusun'],
  openGraph: {
    type: 'website',
    locale: 'id_ID',
    url: 'https://dusunmatteko.my.id',
    siteName: 'Dusun Matteko Digital',
    title: 'Dusun Matteko Digital - Website Resmi Dusun Matteko',
    description: 'Website resmi Dusun Matteko, Kabupaten Gowa. Informasi pemerintahan, berita, statistik penduduk, dan potensi dusun.',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Dusun Matteko Digital',
    description: 'Website resmi Dusun Matteko, Kabupaten Gowa.',
  },
  icons: {
    icon: '/logo.webp',
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const profil = await getProfilDusun();


  return (
    <html lang="id" suppressHydrationWarning>

      <body className={`${montserrat.className} flex flex-col min-h-screen antialiased`} suppressHydrationWarning>
        <TooltipProvider>
          <ConditionalLayout profil={profil || undefined}>{children}</ConditionalLayout>
        </TooltipProvider>
      </body>
    </html>
  );
}

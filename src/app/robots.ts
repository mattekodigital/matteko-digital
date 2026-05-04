import { MetadataRoute } from 'next'

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      {
        userAgent: '*',
        allow: '/',
        disallow: ['/dashboard/', '/dashboard', '/login'],
      },
    ],
    sitemap: 'https://matteko.desa.id/sitemap.xml',
  }
}

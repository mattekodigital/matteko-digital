import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'shprkmtnsgtguiqkousf.supabase.co',
        port: '',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'cdn-icons-png.flaticon.com',
        port: '',
        pathname: '/**',
      },
    ],
  },

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'SAMEORIGIN' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              "script-src 'self' 'unsafe-inline' 'unsafe-eval'",
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              "img-src 'self' data: blob: https://shprkmtnsgtguiqkousf.supabase.co https://cdn-icons-png.flaticon.com",
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self' https://shprkmtnsgtguiqkousf.supabase.co wss://shprkmtnsgtguiqkousf.supabase.co",
              "frame-src https://maps.google.com https://www.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

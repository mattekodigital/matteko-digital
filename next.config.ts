import type { NextConfig } from "next";

const isDev = process.env.NODE_ENV === "development";
const supabaseImageHost = process.env.NEXT_PUBLIC_SUPABASE_URL
  ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
  : null;

const remotePatterns: NonNullable<NextConfig["images"]>["remotePatterns"] = [
  {
    protocol: "https",
    hostname: "cdn-icons-png.flaticon.com",
    port: "",
    pathname: "/**",
  },
];

if (supabaseImageHost) {
  remotePatterns.push({
    protocol: "https",
    hostname: supabaseImageHost,
    port: "",
    pathname: "/storage/v1/object/public/**",
  });
}

const nextConfig: NextConfig = {
  images: {
    remotePatterns,
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
            key: 'Strict-Transport-Security',
            value: 'max-age=31536000; includeSubDomains; preload',
          },
          {
            key: 'Cross-Origin-Opener-Policy',
            value: 'same-origin-allow-popups',
          },
          {
            key: 'Permissions-Policy',
            value: 'camera=(), microphone=(), geolocation=()',
          },
          {
            key: 'Content-Security-Policy',
            value: [
              "default-src 'self'",
              `script-src 'self' 'unsafe-inline'${isDev ? " 'unsafe-eval'" : ""}`,
              "style-src 'self' 'unsafe-inline' https://fonts.googleapis.com",
              ["img-src 'self' data: blob: https://cdn-icons-png.flaticon.com", supabaseImageHost ? `https://${supabaseImageHost}` : null]
                .filter(Boolean)
                .join(" "),
              "font-src 'self' https://fonts.gstatic.com",
              "connect-src 'self'",
              "frame-src https://maps.google.com https://www.google.com",
            ].join('; '),
          },
        ],
      },
    ];
  },
};

export default nextConfig;

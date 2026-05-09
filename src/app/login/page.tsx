import { redirect } from "next/navigation"
import { getCurrentAdmin } from "@/lib/auth"
import LoginForm from "./_components/LoginForm"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login Admin — Desa Matteko Digital",
  description: "Masuk ke panel administrasi Desa Matteko Digital",
}

export default async function LoginPage() {
  // Jika sudah login, langsung redirect ke dashboard
  const user = await getCurrentAdmin()

  if (user) {
    redirect("/dashboard")
  }

  return (
    <div
      className="min-h-screen flex items-center justify-center relative overflow-hidden"
      style={{ background: "oklch(0.09 0.015 264)" }}
    >
      {/* Background decorative blobs */}
      <div
        className="absolute top-[-15%] left-[-10%] w-[500px] h-[500px] rounded-full blur-[120px] opacity-20 pointer-events-none"
        style={{ background: "oklch(0.55 0.22 264)" }}
      />
      <div
        className="absolute bottom-[-10%] right-[-5%] w-[400px] h-[400px] rounded-full blur-[100px] opacity-15 pointer-events-none"
        style={{ background: "oklch(0.55 0.22 264)" }}
      />
      <div
        className="absolute top-[40%] right-[20%] w-[200px] h-[200px] rounded-full blur-[80px] opacity-10 pointer-events-none"
        style={{ background: "oklch(0.7 0.18 200)" }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.04]"
        style={{
          backgroundImage:
            "linear-gradient(oklch(0.92 0 0) 1px, transparent 1px), linear-gradient(90deg, oklch(0.92 0 0) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="w-full max-w-md px-4 relative z-10">
        {/* Logo / Header */}
        <div className="flex flex-col items-center mb-8 text-center">
          <div
            className="w-16 h-16 rounded-2xl flex items-center justify-center mb-4 shadow-lg"
            style={{
              background:
                "linear-gradient(135deg, oklch(0.55 0.22 264), oklch(0.45 0.2 264))",
              boxShadow: "0 8px 32px oklch(0.55 0.22 264 / 0.35)",
            }}
          >
            <svg
              className="w-9 h-9 text-white"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
              <polyline points="9 22 9 12 15 12 15 22" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white tracking-tight">
            Panel Admin
          </h1>
          <p className="text-sm mt-1" style={{ color: "oklch(0.65 0.05 264)" }}>
            Dusun Matteko Digital
          </p>
        </div>

        {/* Card */}
        <div
          className="rounded-2xl p-8 border"
          style={{
            background: "oklch(0.13 0.015 264 / 0.85)",
            backdropFilter: "blur(16px)",
            borderColor: "oklch(1 0 0 / 0.08)",
            boxShadow:
              "0 25px 60px oklch(0 0 0 / 0.5), 0 0 0 1px oklch(1 0 0 / 0.05)",
          }}
        >
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white">Selamat Datang</h2>
            <p className="text-sm mt-1" style={{ color: "oklch(0.6 0.04 264)" }}>
              Masuk untuk mengelola konten dusun
            </p>
          </div>

          <LoginForm />
        </div>

        {/* Footer */}
        <p
          className="text-center text-xs mt-6"
          style={{ color: "oklch(0.45 0.03 264)" }}
        >
          © {new Date().getFullYear()} Dusun Matteko - Sistem Informasi Dusun
        </p>
      </div>
    </div>
  )
}

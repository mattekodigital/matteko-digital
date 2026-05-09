"use client"

import { useState, useTransition } from "react"
import { useRouter } from "next/navigation"
import { loginAction } from "../_actions/login"
import { EyeIcon, EyeOffIcon, LoaderIcon, LockIcon, MailIcon } from "lucide-react"

export default function LoginForm() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const [showPassword, setShowPassword] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    setError(null)
    const form = e.currentTarget
    const formData = new FormData(form)

    startTransition(async () => {
      const result = await loginAction(formData)
      if (result?.error) {
        setError(result.error)
      } else {
        router.push("/dashboard")
        router.refresh()
      }
    })
  }

  const inputBase: React.CSSProperties = {
    background: "oklch(0.09 0.012 264)",
    border: "1px solid oklch(1 0 0 / 0.1)",
    color: "white",
    borderRadius: "0.625rem",
    width: "100%",
    padding: "0.625rem 1rem",
    fontSize: "0.9rem",
    outline: "none",
    transition: "border-color 0.2s, box-shadow 0.2s",
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5" id="login-form">
      {/* Email */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="email"
          className="text-sm font-medium"
          style={{ color: "oklch(0.78 0.04 264)" }}
        >
          Email
        </label>
        <div className="relative">
          <MailIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
            style={{ color: "oklch(0.5 0.05 264)" }}
          />
          <input
            id="email"
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="admin@dusunmatteko.id"
            style={{ ...inputBase, paddingLeft: "2.5rem" }}
            onFocus={(e) => {
              e.target.style.borderColor = "oklch(0.55 0.22 264)"
              e.target.style.boxShadow = "0 0 0 3px oklch(0.55 0.22 264 / 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "oklch(1 0 0 / 0.1)"
              e.target.style.boxShadow = "none"
            }}
          />
        </div>
      </div>

      {/* Password */}
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="password"
          className="text-sm font-medium"
          style={{ color: "oklch(0.78 0.04 264)" }}
        >
          Password
        </label>
        <div className="relative">
          <LockIcon
            className="absolute left-3 top-1/2 -translate-y-1/2 size-4"
            style={{ color: "oklch(0.5 0.05 264)" }}
          />
          <input
            id="password"
            name="password"
            type={showPassword ? "text" : "password"}
            autoComplete="current-password"
            required
            placeholder="••••••••"
            style={{ ...inputBase, paddingLeft: "2.5rem", paddingRight: "3rem" }}
            onFocus={(e) => {
              e.target.style.borderColor = "oklch(0.55 0.22 264)"
              e.target.style.boxShadow = "0 0 0 3px oklch(0.55 0.22 264 / 0.2)"
            }}
            onBlur={(e) => {
              e.target.style.borderColor = "oklch(1 0 0 / 0.1)"
              e.target.style.boxShadow = "none"
            }}
          />
          <button
            type="button"
            id="toggle-password"
            onClick={() => setShowPassword((v) => !v)}
            className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded transition-colors"
            style={{ color: "oklch(0.5 0.05 264)" }}
            aria-label={showPassword ? "Sembunyikan password" : "Tampilkan password"}
          >
            {showPassword ? (
              <EyeOffIcon className="size-4" />
            ) : (
              <EyeIcon className="size-4" />
            )}
          </button>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div
          className="rounded-lg px-4 py-3 text-sm flex items-center gap-2"
          style={{
            background: "oklch(0.4 0.18 25 / 0.15)",
            border: "1px solid oklch(0.6 0.2 25 / 0.35)",
            color: "oklch(0.8 0.15 25)",
          }}
          role="alert"
          aria-live="polite"
        >
          <span className="shrink-0">⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {/* Submit */}
      <button
        type="submit"
        id="login-submit-btn"
        disabled={isPending}
        className="w-full py-2.5 px-4 rounded-xl font-semibold text-sm text-white flex items-center justify-center gap-2 transition-all duration-200 disabled:opacity-60 disabled:cursor-not-allowed"
        style={{
          background: isPending
            ? "oklch(0.45 0.18 264)"
            : "linear-gradient(135deg, oklch(0.55 0.22 264), oklch(0.48 0.2 264))",
          boxShadow: isPending
            ? "none"
            : "0 4px 20px oklch(0.55 0.22 264 / 0.35)",
        }}
        onMouseEnter={(e) => {
          if (!isPending) {
            ;(e.target as HTMLButtonElement).style.transform = "translateY(-1px)"
            ;(e.target as HTMLButtonElement).style.boxShadow =
              "0 6px 24px oklch(0.55 0.22 264 / 0.45)"
          }
        }}
        onMouseLeave={(e) => {
          ;(e.target as HTMLButtonElement).style.transform = "translateY(0)"
          ;(e.target as HTMLButtonElement).style.boxShadow =
            "0 4px 20px oklch(0.55 0.22 264 / 0.35)"
        }}
      >
        {isPending ? (
          <>
            <LoaderIcon className="size-4 animate-spin" />
            <span>Memproses...</span>
          </>
        ) : (
          "Masuk ke Dashboard"
        )}
      </button>
    </form>
  )
}

"use server"

import { createClient } from "@/lib/supabase/server"
import { z } from "zod"

// ─── Validation schema ─────────────────────────────────────────────────────
const LoginSchema = z.object({
  email: z.email("Format email tidak valid"),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

// ─── Generic error helper (jangan bocorkan detail internal ke client) ──────
const GENERIC_AUTH_ERROR =
  "Email atau password salah. Silakan coba lagi."

// ─── Action ───────────────────────────────────────────────────────────────
export async function loginAction(
  formData: FormData
): Promise<{ error: string } | void> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  // Validasi input
  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Input tidak valid"
    return { error: firstError }
  }

  const { email, password } = parsed.data

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })

  if (error) {
    // Log error di server (tidak terekspos ke client)
    console.error("[LoginAction] Supabase auth error:", error.message)
    // Kembalikan pesan generik agar tidak bocorkan info sensitif
    return { error: GENERIC_AUTH_ERROR }
  }

  // Redirect ditangani di client setelah action sukses (void = sukses)
}

// ─── Logout action ────────────────────────────────────────────────────────
export async function logoutAction(): Promise<void> {
  const supabase = await createClient()
  await supabase.auth.signOut()
}

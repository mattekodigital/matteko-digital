"use server"

import { authenticateAdmin, clearAdminSession, setAdminSession } from "@/lib/auth"
import { z } from "zod"

const LoginSchema = z.object({
  email: z.email("Format email tidak valid").trim().toLowerCase(),
  password: z.string().min(6, "Password minimal 6 karakter"),
})

const GENERIC_AUTH_ERROR =
  "Email atau password salah. Silakan coba lagi."
const AUTH_SERVICE_ERROR =
  "Login belum bisa diproses karena koneksi database bermasalah. Cek PostgreSQL lalu coba lagi."

export async function loginAction(
  formData: FormData
): Promise<{ error: string } | void> {
  const raw = {
    email: formData.get("email"),
    password: formData.get("password"),
  }

  const parsed = LoginSchema.safeParse(raw)
  if (!parsed.success) {
    const firstError = parsed.error.issues[0]?.message ?? "Input tidak valid"
    return { error: firstError }
  }

  const { email, password } = parsed.data

  try {
    const admin = await authenticateAdmin(email, password)

    if (!admin) {
      return { error: GENERIC_AUTH_ERROR }
    }

    await setAdminSession(admin)
  } catch (error) {
    console.error("Login action failed", {
      email,
      error,
    })

    return { error: AUTH_SERVICE_ERROR }
  }
}

export async function logoutAction(): Promise<void> {
  await clearAdminSession()
}

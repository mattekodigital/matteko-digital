import "server-only"

import bcrypt from "bcryptjs"
import { createHash, timingSafeEqual } from "crypto"
import { cookies } from "next/headers"
import { query } from "@/lib/db"
import {
  AUTH_COOKIE_NAME,
  createSessionToken,
  verifySessionToken,
  type AdminSession,
} from "@/lib/session"

interface AdminUserRow {
  id?: string | number
  email?: string
  name?: string | null
  full_name?: string | null
  nama?: string | null
  avatar_url?: string | null
  password?: string | null
  password_hash?: string | null
  hashed_password?: string | null
  password_digest?: string | null
  encrypted_password?: string | null
}

function safeEqual(a: string, b: string) {
  const left = Buffer.from(a)
  const right = Buffer.from(b)
  return left.length === right.length && timingSafeEqual(left, right)
}

async function verifyPassword(password: string, stored?: string | null) {
  if (!stored) return false

  if (/^\$2[aby]\$/.test(stored)) {
    return bcrypt.compare(password, stored)
  }

  if (stored.startsWith("sha256:")) {
    const digest = createHash("sha256").update(password).digest("hex")
    return safeEqual(digest, stored.slice("sha256:".length))
  }

  if (/^[a-f0-9]{64}$/i.test(stored)) {
    const digest = createHash("sha256").update(password).digest("hex")
    return safeEqual(digest, stored)
  }

  return safeEqual(password, stored)
}

export async function authenticateAdmin(email: string, password: string) {
  const { rows } = await query<AdminUserRow>(
    "SELECT * FROM admin_users WHERE lower(email) = lower($1) LIMIT 1",
    [email]
  )
  const user = rows[0]
  if (!user?.email) return null

  const storedPassword =
    user.password_hash ??
    user.hashed_password ??
    user.password_digest ??
    user.encrypted_password ??
    user.password

  const valid = await verifyPassword(password, storedPassword)
  if (!valid) return null

  const name = user.full_name ?? user.name ?? user.nama ?? "Administrator"

  return {
    id: String(user.id ?? user.email),
    email: user.email,
    name,
    avatar_url: user.avatar_url ?? null,
  }
}

export async function setAdminSession(admin: Omit<AdminSession, "exp">) {
  const token = await createSessionToken(admin)
  const cookieStore = await cookies()

  cookieStore.set(AUTH_COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 8,
  })
}

export async function clearAdminSession() {
  const cookieStore = await cookies()
  cookieStore.delete(AUTH_COOKIE_NAME)
}

export async function getCurrentAdmin() {
  const cookieStore = await cookies()
  return verifySessionToken(cookieStore.get(AUTH_COOKIE_NAME)?.value)
}

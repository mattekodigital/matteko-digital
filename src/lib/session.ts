export const AUTH_COOKIE_NAME = "matteko_admin_session"

export interface AdminSession {
  id: string
  email: string
  name: string
  avatar_url?: string | null
  exp: number
}

const encoder = new TextEncoder()

function getSecret() {
  return (
    process.env.AUTH_SECRET ??
    process.env.NEXT_SERVER_ACTIONS_ENCRYPTION_KEY ??
    process.env.DATABASE_URL ??
    "matteko-local-session-secret"
  )
}

function bytesToBase64Url(bytes: Uint8Array) {
  const base64 =
    typeof Buffer !== "undefined"
      ? Buffer.from(bytes).toString("base64")
      : btoa(String.fromCharCode(...bytes))

  return base64.replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "")
}

function base64UrlToString(value: string) {
  const base64 = value.replace(/-/g, "+").replace(/_/g, "/")
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=")

  if (typeof Buffer !== "undefined") {
    return Buffer.from(padded, "base64").toString("utf8")
  }

  return decodeURIComponent(
    Array.from(atob(padded), (char) =>
      `%${char.charCodeAt(0).toString(16).padStart(2, "0")}`
    ).join("")
  )
}

function stringToBase64Url(value: string) {
  return bytesToBase64Url(encoder.encode(value))
}

async function hmac(value: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    encoder.encode(getSecret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  )
  const signature = await crypto.subtle.sign("HMAC", key, encoder.encode(value))
  return bytesToBase64Url(new Uint8Array(signature))
}

export async function createSessionToken(session: Omit<AdminSession, "exp">) {
  const payload = stringToBase64Url(
    JSON.stringify({
      ...session,
      exp: Math.floor(Date.now() / 1000) + 60 * 60 * 8,
    })
  )
  const signature = await hmac(payload)

  return `${payload}.${signature}`
}

export async function verifySessionToken(token?: string): Promise<AdminSession | null> {
  if (!token) return null

  const [payload, signature] = token.split(".")
  if (!payload || !signature) return null

  const expected = await hmac(payload)
  if (signature !== expected) return null

  try {
    const session = JSON.parse(base64UrlToString(payload)) as AdminSession
    if (!session.exp || session.exp < Math.floor(Date.now() / 1000)) {
      return null
    }
    return session
  } catch {
    return null
  }
}

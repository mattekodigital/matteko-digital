import path from "path"

const DEFAULT_UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads")
const DEFAULT_UPLOAD_BASE_URL = "/uploads"

const MIME_TYPES: Record<string, string> = {
  avif: "image/avif",
  gif: "image/gif",
  jpeg: "image/jpeg",
  jpg: "image/jpeg",
  png: "image/png",
  svg: "image/svg+xml",
  webp: "image/webp",
}

function trimTrailingSlash(value: string) {
  return value.replace(/\/+$/, "") || "/"
}

function safePathSegment(value: string) {
  return value.replace(/[^a-z0-9._-]/gi, "")
}

export function resolveUploadRoot() {
  const configuredRoot = process.env.UPLOAD_ROOT?.trim()
  if (!configuredRoot) return DEFAULT_UPLOAD_ROOT
  return path.isAbsolute(configuredRoot)
    ? configuredRoot
    : path.join(process.cwd(), configuredRoot)
}

export function resolveUploadBaseUrl() {
  const configuredBaseUrl = process.env.UPLOAD_BASE_URL?.trim()
  if (!configuredBaseUrl) return DEFAULT_UPLOAD_BASE_URL
  return trimTrailingSlash(configuredBaseUrl.startsWith("/") ? configuredBaseUrl : `/${configuredBaseUrl}`)
}

export function buildUploadUrl(folder: string, filename: string) {
  return `${resolveUploadBaseUrl()}/${safePathSegment(folder)}/${safePathSegment(filename)}`
}

export function resolveUploadFilePath(segments: string[]) {
  const safeSegments = segments
    .map((segment) => safePathSegment(segment))
    .filter(Boolean)

  if (safeSegments.length === 0) return null
  return path.join(resolveUploadRoot(), ...safeSegments)
}

export function getMimeTypeFromFilename(filename: string) {
  const extension = filename.split(".").pop()?.toLowerCase() ?? ""
  return MIME_TYPES[extension] ?? "application/octet-stream"
}

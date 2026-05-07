import { mkdir, writeFile } from "fs/promises"
import path from "path"
import { NextResponse } from "next/server"
import { buildUploadUrl, resolveUploadRoot } from "@/lib/uploads"

export const runtime = "nodejs"

const MAX_FILE_SIZE = 5 * 1024 * 1024
const ALLOWED_TYPES = new Set(["image/jpeg", "image/png", "image/webp", "image/gif"])

function safeFolder(value: FormDataEntryValue | null) {
  if (typeof value !== "string") return "images"
  return value.replace(/[^a-z0-9-]/gi, "").toLowerCase() || "images"
}

function extensionFrom(file: File) {
  const fromName = file.name.split(".").pop()?.toLowerCase()
  if (fromName && /^[a-z0-9]+$/.test(fromName)) return fromName
  return file.type.split("/")[1] || "bin"
}

export async function POST(request: Request) {
  try {
    const formData = await request.formData()
    const file = formData.get("file")

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "File tidak ditemukan" }, { status: 400 })
    }

    if (!ALLOWED_TYPES.has(file.type)) {
      return NextResponse.json({ error: "Tipe file tidak didukung" }, { status: 400 })
    }

    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Ukuran file maksimal 5MB" }, { status: 400 })
    }

    const folder = safeFolder(formData.get("folder"))
    const uploadDir = path.join(resolveUploadRoot(), folder)
    await mkdir(uploadDir, { recursive: true })

    const filename = `${Date.now()}-${crypto.randomUUID()}.${extensionFrom(file)}`
    const filePath = path.join(uploadDir, filename)
    const buffer = Buffer.from(await file.arrayBuffer())
    await writeFile(filePath, buffer)

    return NextResponse.json({ url: buildUploadUrl(folder, filename) })
  } catch (error) {
    console.error("Upload gagal", error)
    return NextResponse.json(
      { error: "Server gagal menyimpan file. Periksa izin folder upload di VPS." },
      { status: 500 }
    )
  }
}

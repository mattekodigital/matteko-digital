import { readFile } from "fs/promises"
import { NextResponse } from "next/server"
import { getMimeTypeFromFilename, resolveUploadFilePath } from "@/lib/uploads"

export const runtime = "nodejs"

export async function GET(
  _request: Request,
  context: { params: Promise<{ slug: string[] }> }
) {
  try {
    const { slug } = await context.params
    const filePath = resolveUploadFilePath(slug)
    const filename = slug.at(-1)

    if (!filePath || !filename) {
      return new NextResponse("File tidak ditemukan", { status: 404 })
    }

    const file = await readFile(filePath)

    return new NextResponse(file, {
      headers: {
        "Content-Type": getMimeTypeFromFilename(filename),
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  } catch {
    return new NextResponse("File tidak ditemukan", { status: 404 })
  }
}

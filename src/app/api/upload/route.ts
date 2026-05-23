import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "No file provided" }, { status: 400 });

    const ext = file.name.split(".").pop()?.toLowerCase() ?? "bin";
    const isVideo = ["mp4", "mov", "webm", "ogg"].includes(ext);
    const isImage = ["jpg", "jpeg", "png", "webp", "gif", "avif"].includes(ext);
    if (!isVideo && !isImage) {
      return NextResponse.json({ error: "Unsupported file type" }, { status: 400 });
    }

    const subfolder = isVideo ? "videos" : "images";
    const uploadDir = join(process.cwd(), "public", "media", "uploads", subfolder);
    await mkdir(uploadDir, { recursive: true });

    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${timestamp}-${safeName}`;
    const bytes = await file.arrayBuffer();
    await writeFile(join(uploadDir, filename), Buffer.from(bytes));

    return NextResponse.json({ path: `/media/uploads/${subfolder}/${filename}`, type: isVideo ? "video" : "image" });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}

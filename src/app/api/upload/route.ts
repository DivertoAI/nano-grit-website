import { mkdir, writeFile } from "fs/promises";
import { NextRequest, NextResponse } from "next/server";
import { join } from "path";

const isVercel = process.env.VERCEL === "1";

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
    const timestamp = Date.now();
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, "-");
    const filename = `${timestamp}-${safeName}`;
    const bytes = await file.arrayBuffer();

    if (isVercel) {
      // Vercel has a read-only filesystem — write to /tmp so the upload doesn't crash,
      // but the file won't survive beyond this request. Return a warning so the admin
      // UI can tell the user to commit the file via git instead.
      const tmpDir = join("/tmp", "ng-uploads", subfolder);
      await mkdir(tmpDir, { recursive: true });
      await writeFile(join(tmpDir, filename), Buffer.from(bytes));
      return NextResponse.json({
        path: `/media/uploads/${subfolder}/${filename}`,
        type: isVideo ? "video" : "image",
        warning: "File saved temporarily. To make it permanent, add it to public/media/ in the repo and redeploy.",
      });
    }

    // Local dev — write directly to public so it's served immediately
    const uploadDir = join(process.cwd(), "public", "media", "uploads", subfolder);
    await mkdir(uploadDir, { recursive: true });
    await writeFile(join(uploadDir, filename), Buffer.from(bytes));
    return NextResponse.json({ path: `/media/uploads/${subfolder}/${filename}`, type: isVideo ? "video" : "image" });
  } catch (err) {
    console.error("Upload error:", err);
    return NextResponse.json({ error: "Upload failed" }, { status: 500 });
  }
}


import fs from "fs/promises";
import path from "path";

const UPLOAD_DIR = path.resolve(process.cwd(), "uploads");

const MEDIA_FIELDS = new Set([
  "image",
  "logo",
  "video",
  "poster",
  "videoPoster",
  "backgroundImage",
]);

// Collect only media URLs from the homepage document.
// Normal links such as /contact are deliberately ignored.
export function collectMediaUrls(value, parentKey = "") {
  const urls = new Set();

  if (Array.isArray(value)) {
    for (const item of value) {
      for (const url of collectMediaUrls(item, parentKey)) {
        urls.add(url);
      }
    }
    return urls;
  }

  if (!value || typeof value !== "object") {
    if (
      typeof value === "string" &&
      MEDIA_FIELDS.has(parentKey) &&
      value.includes("/uploads/")
    ) {
      urls.add(value);
    }

    return urls;
  }

  for (const [key, child] of Object.entries(value)) {
    for (const url of collectMediaUrls(child, key)) {
      urls.add(url);
    }
  }

  return urls;
}

// Delete only files inside this backend's uploads directory.
// This prevents paths outside uploads from being deleted.
export async function deleteUploadedMedia(urls = []) {
  for (const mediaUrl of urls) {
    try {
      const pathname = new URL(
        mediaUrl,
        "http://localhost"
      ).pathname;

      if (!pathname.startsWith("/uploads/")) continue;

      const filename = path.basename(pathname);
      if (!filename) continue;

      const filePath = path.resolve(UPLOAD_DIR, filename);

      if (!filePath.startsWith(`${UPLOAD_DIR}${path.sep}`)) {
        continue;
      }

      await fs.unlink(filePath);
      console.log(`Deleted old media: ${filename}`);
    } catch (error) {
      if (error.code !== "ENOENT") {
        console.error("Media cleanup failed:", error.message);
      }
    }
  }
}

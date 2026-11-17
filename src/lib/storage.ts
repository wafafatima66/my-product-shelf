import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import { del, put } from "@vercel/blob";
import sharp from "sharp";

/**
 * Photo storage. With BLOB_READ_WRITE_TOKEN set (Vercel) photos go to Vercel Blob and the
 * product keeps the photo's full public URL. Without it (local work) they go to ./uploads
 * and the product keeps a short random key. Everything else in the app only sees `key`.
 */
const DIR = path.join(process.cwd(), "uploads");
const blobEnabled = () => !!process.env.BLOB_READ_WRITE_TOKEN;

const isUrl = (key: string) => key.startsWith("https://");
/** Only ever fetch or delete our own Blob store, never an arbitrary address from the database. */
const isBlobUrl = (key: string) => {
  try {
    return new URL(key).hostname.endsWith(".public.blob.vercel-storage.com");
  } catch {
    return false;
  }
};
const thumbOf = (url: string) => url.replace(/\.jpg$/, "-t.jpg");

export async function saveImage(input: Buffer) {
  const id = randomBytes(10).toString("hex");
  let full: { data: Buffer; info: { width: number; height: number } };
  let thumb: Buffer;
  try {
    const base = sharp(input, { failOn: "none" }).rotate();
    full = await base
      .clone()
      .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 82, mozjpeg: true })
      .toBuffer({ resolveWithObject: true });
    thumb = await base
      .clone()
      .resize({ width: 560, height: 560, fit: "inside", withoutEnlargement: true })
      .jpeg({ quality: 76, mozjpeg: true })
      .toBuffer();
  } catch (e) {
    // The file is not a picture we can read. Anything thrown after this point is a storage problem.
    console.error("photo could not be processed", e);
    throw new Error("bad_image");
  }

  if (blobEnabled()) {
    const opts = { access: "public", contentType: "image/jpeg", addRandomSuffix: false, cacheControlMaxAge: 31536000 } as const;
    const [big] = await Promise.all([
      put(`photos/${id}.jpg`, full.data, opts),
      put(`photos/${id}-t.jpg`, thumb, opts),
    ]);
    return { key: big.url, width: full.info.width, height: full.info.height };
  }

  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, `${id}.jpg`), full.data);
  await writeFile(path.join(DIR, `${id}-t.jpg`), thumb);
  return { key: id, width: full.info.width, height: full.info.height };
}

export async function readImage(key: string, thumb: boolean) {
  if (isUrl(key)) {
    if (!isBlobUrl(key)) return null;
    try {
      const res = await fetch(thumb ? thumbOf(key) : key);
      return res.ok ? Buffer.from(await res.arrayBuffer()) : null;
    } catch {
      return null;
    }
  }
  if (!/^[a-f0-9]{20}$/.test(key)) return null;
  try {
    return await readFile(path.join(DIR, `${key}${thumb ? "-t" : ""}.jpg`));
  } catch {
    return null;
  }
}

export async function deleteImage(key: string) {
  if (isUrl(key)) {
    if (isBlobUrl(key) && blobEnabled()) await del([key, thumbOf(key)]);
    return;
  }
  if (!/^[a-f0-9]{20}$/.test(key)) return;
  await Promise.all([
    rm(path.join(DIR, `${key}.jpg`), { force: true }),
    rm(path.join(DIR, `${key}-t.jpg`), { force: true }),
  ]);
}

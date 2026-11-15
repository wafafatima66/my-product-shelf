import "server-only";
import { mkdir, readFile, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { randomBytes } from "node:crypto";
import sharp from "sharp";

/**
 * Photo storage. Today it writes to ./uploads on disk. When we move to
 * Supabase, only this file changes (upload to a Storage bucket instead).
 */
const DIR = path.join(process.cwd(), "uploads");

export async function saveImage(input: Buffer) {
  const key = randomBytes(10).toString("hex");
  const base = sharp(input, { failOn: "none" }).rotate();
  const full = await base
    .clone()
    .resize({ width: 1400, height: 1400, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 82, mozjpeg: true })
    .toBuffer({ resolveWithObject: true });
  const thumb = await base
    .clone()
    .resize({ width: 560, height: 560, fit: "inside", withoutEnlargement: true })
    .jpeg({ quality: 76, mozjpeg: true })
    .toBuffer();
  await mkdir(DIR, { recursive: true });
  await writeFile(path.join(DIR, `${key}.jpg`), full.data);
  await writeFile(path.join(DIR, `${key}-t.jpg`), thumb);
  return { key, width: full.info.width, height: full.info.height };
}

export async function readImage(key: string, thumb: boolean) {
  if (!/^[a-f0-9]{20}$/.test(key)) return null;
  try {
    return await readFile(path.join(DIR, `${key}${thumb ? "-t" : ""}.jpg`));
  } catch {
    return null;
  }
}

export async function deleteImage(key: string) {
  if (!/^[a-f0-9]{20}$/.test(key)) return;
  await Promise.all([
    rm(path.join(DIR, `${key}.jpg`), { force: true }),
    rm(path.join(DIR, `${key}-t.jpg`), { force: true }),
  ]);
}

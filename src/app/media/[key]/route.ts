import { readImage } from "@/lib/storage";

export async function GET(req: Request, { params }: { params: Promise<{ key: string }> }) {
  const { key } = await params;
  const thumb = new URL(req.url).searchParams.get("t") === "1";
  const file = await readImage(key, thumb);
  if (!file) return new Response("Not found", { status: 404 });
  return new Response(new Uint8Array(file), {
    headers: {
      "Content-Type": "image/jpeg",
      // Photo keys are random and never reused, so they can be cached for a long time.
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
}

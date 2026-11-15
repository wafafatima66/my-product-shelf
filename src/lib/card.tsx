import "server-only";
import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import type { ReactNode } from "react";
import { ImageResponse } from "next/og";
import sharp from "sharp";

/**
 * The "share card": a designed picture of a product (photo, name, price, code and shop name).
 * It is what a link preview shows in WhatsApp/Messenger and what "Save as picture" downloads.
 *
 * Layout is drawn with Satori (next/og). Satori cannot join Bangla letters correctly,
 * so any text containing Bangla is drawn by sharp (Pango/HarfBuzz) and placed as a small image.
 */
export type CardInput = {
  shopName: string;
  name: string;
  code: string;
  price: string; // already formatted, "" when there is no price
  image: string | null; // a data: URI or an https URL
  format: "og" | "story";
};

const ORANGE = "#e17738";
const INK = "#393533";
const PAPER = "#f2eee9";
const MUTED = "#817d7a";

let fontCache: { name: string; data: Buffer; weight: 700 | 800; style: "normal" }[] | null = null;

// The `new URL("literal", import.meta.url)` form is what lets Next include the font files in a deployment.
async function fonts() {
  if (fontCache) return fontCache;
  const [inter700, inter800, bengali] = await Promise.all([
    readFile(new URL("../assets/fonts/Inter-700.woff", import.meta.url)),
    readFile(new URL("../assets/fonts/Inter-800.woff", import.meta.url)),
    readFile(new URL("../assets/fonts/NotoSansBengali-700.woff", import.meta.url)),
  ]);
  fontCache = [
    { name: "Inter", data: inter700, weight: 700, style: "normal" },
    { name: "Inter", data: inter800, weight: 800, style: "normal" },
    { name: "Noto Sans Bengali", data: bengali, weight: 700, style: "normal" }, // for the ৳ sign and digits
  ];
  return fontCache;
}

export const dataUri = (buf: Buffer) => `data:image/jpeg;base64,${buf.toString("base64")}`;

const hasBangla = (s: string) => /[ঀ-৿]/.test(s);
const escapeMarkup = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

type TextStyle = { size: number; weight: 700 | 800; color: string; maxWidth: number; lineHeight?: number };

/** One block of text. Bangla goes through sharp so the letters join correctly. */
async function text(value: string, s: TextStyle): Promise<ReactNode> {
  if (!value) return null;
  if (!hasBangla(value)) {
    return <div style={{ display: "flex", fontSize: s.size, fontWeight: s.weight, color: s.color, lineHeight: s.lineHeight ?? 1.1, maxWidth: s.maxWidth }}>{value}</div>;
  }
  const { data, info } = await sharp({
    text: {
      text: `<span foreground="${s.color}">${escapeMarkup(value)}</span>`,
      font: `Noto Sans Bengali Bold ${s.size}`,
      fontfile: fileURLToPath(new URL("../assets/fonts/NotoSansBengali-700.woff", import.meta.url)),
      width: s.maxWidth,
      dpi: 72,
      spacing: Math.round(s.size * 0.12),
      rgba: true,
    },
  })
    .png()
    .toBuffer({ resolveWithObject: true });
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={`data:image/png;base64,${data.toString("base64")}`} width={info.width} height={info.height} alt="" />;
}

function Mark({ size }: { size: number }) {
  const bar = (w: number, o = 1) => ({ display: "flex", height: size * 0.17, width: size * w, borderRadius: size * 0.05, background: "#fff", opacity: o });
  return (
    <div style={{ display: "flex", flexDirection: "column", justifyContent: "center", gap: size * 0.1, width: size, height: size, padding: size * 0.2, borderRadius: size * 0.28, background: ORANGE }}>
      <div style={bar(0.5)} />
      <div style={bar(0.6, 0.75)} />
      <div style={bar(0.4)} />
    </div>
  );
}

function Brand({ size }: { size: number }) {
  return (
    <div style={{ display: "flex", alignItems: "center", gap: size * 0.3 }}>
      <Mark size={size} />
      <div style={{ display: "flex", fontSize: size * 0.62, fontWeight: 800, color: INK }}>
        <span style={{ marginRight: size * 0.16 }}>My</span>
        <span style={{ color: ORANGE }}>Product</span>
        <span style={{ marginLeft: size * 0.16 }}>Shelf</span>
      </div>
    </div>
  );
}

function Photo({ src, w, h, radius, initial }: { src: string | null; w: number; h: number; radius: number; initial: ReactNode }) {
  if (!src) {
    return (
      <div style={{ display: "flex", alignItems: "center", justifyContent: "center", width: w, height: h, borderRadius: radius, background: "#fcebdd", color: ORANGE, fontSize: h * 0.4, fontWeight: 800 }}>
        {initial}
      </div>
    );
  }
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={src} width={w} height={h} alt="" style={{ width: w, height: h, objectFit: "cover", borderRadius: radius }} />;
}

export async function renderCard(c: CardInput) {
  const title = c.name || c.code || c.shopName;
  const initial = hasBangla(title) ? "★" : (Array.from(title)[0] ?? "★").toUpperCase();
  const fontFamily = "Inter, Noto Sans Bengali";
  const options = {
    fonts: await fonts(),
    headers: { "Cache-Control": "public, max-age=300, s-maxage=300" },
  };

  if (c.format === "story") {
    const W = 1080, H = 1350;
    const nameSize = title.length > 26 ? 58 : 72;
    const [shop, nameNode, codeNode] = await Promise.all([
      text(c.shopName, { size: 32, weight: 700, color: INK, maxWidth: 740 }),
      text(title, { size: nameSize, weight: 800, color: INK, maxWidth: 984 }),
      text(c.code, { size: 28, weight: 700, color: INK, maxWidth: 260 }),
    ]);
    return new ImageResponse(
      (
        <div style={{ display: "flex", flexDirection: "column", width: W, height: H, background: PAPER, padding: 48, fontFamily }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 28 }}>
            <div style={{ display: "flex" }}>{shop}</div>
            {c.code ? <div style={{ display: "flex", background: "#fff", padding: "10px 24px", borderRadius: 999 }}>{codeNode}</div> : null}
          </div>
          <div style={{ display: "flex", padding: 14, background: "#fff", borderRadius: 52, boxShadow: "0 18px 50px rgba(57,53,51,.18)" }}>
            <Photo src={c.image} w={956} h={780} radius={40} initial={initial} />
          </div>
          <div style={{ display: "flex", flexDirection: "column", flex: 1, justifyContent: "space-between", paddingTop: 36 }}>
            <div style={{ display: "flex", flexDirection: "column" }}>
              {nameNode}
              {c.price ? (
                <div style={{ display: "flex", marginTop: 22 }}>
                  <div style={{ display: "flex", fontSize: 54, fontWeight: 800, color: "#fff", background: ORANGE, padding: "8px 36px", borderRadius: 999 }}>{c.price}</div>
                </div>
              ) : null}
            </div>
            <Brand size={52} />
          </div>
        </div>
      ),
      { width: W, height: H, ...options },
    );
  }

  const W = 1200, H = 630;
  const nameSize = title.length > 30 ? 46 : title.length > 18 ? 56 : 66;
  const [shop, nameNode, codeNode] = await Promise.all([
    text(c.shopName, { size: 28, weight: 700, color: ORANGE, maxWidth: 520 }),
    text(title, { size: nameSize, weight: 800, color: INK, maxWidth: 520 }),
    text(c.code, { size: 28, weight: 700, color: MUTED, maxWidth: 520 }),
  ]);
  return new ImageResponse(
    (
      <div style={{ display: "flex", width: W, height: H, background: PAPER, fontFamily }}>
        <div style={{ display: "flex", padding: 30 }}>
          <div style={{ display: "flex", padding: 10, background: "#fff", borderRadius: 40, boxShadow: "0 12px 36px rgba(57,53,51,.2)" }}>
            <Photo src={c.image} w={550} h={550} radius={30} initial={initial} />
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", justifyContent: "space-between", flex: 1, padding: "46px 54px 40px 14px" }}>
          <div style={{ display: "flex", flexDirection: "column" }}>
            {shop}
            <div style={{ display: "flex", marginTop: 14 }}>{nameNode}</div>
            {c.code ? <div style={{ display: "flex", marginTop: 14 }}>{codeNode}</div> : null}
            {c.price ? (
              <div style={{ display: "flex", marginTop: 26 }}>
                <div style={{ display: "flex", fontSize: 50, fontWeight: 800, color: "#fff", background: ORANGE, padding: "6px 30px", borderRadius: 999 }}>{c.price}</div>
              </div>
            ) : null}
          </div>
          <Brand size={44} />
        </div>
      </div>
    ),
    { width: W, height: H, ...options },
  );
}

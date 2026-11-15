import {
  Archivo_Black,
  Cormorant_Garamond,
  DM_Sans,
  DM_Serif_Display,
  Fraunces,
  Fredoka,
  Instrument_Serif,
  Inter,
  Nunito,
  Unbounded,
} from "next/font/google";

export const cormorant = Cormorant_Garamond({ subsets: ["latin"], weight: ["500", "600"], variable: "--font-cormorant", display: "swap" });
export const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
export const fredoka = Fredoka({ subsets: ["latin"], weight: ["500", "600", "700"], variable: "--font-fredoka", display: "swap" });
export const nunito = Nunito({ subsets: ["latin"], weight: ["600", "700", "800"], variable: "--font-nunito", display: "swap" });
export const dmSerif = DM_Serif_Display({ subsets: ["latin"], weight: "400", variable: "--font-dmserif", display: "swap" });
export const dmSans = DM_Sans({ subsets: ["latin"], variable: "--font-dmsans", display: "swap" });

// Bento: very heavy display type
export const archivoBlack = Archivo_Black({ subsets: ["latin"], weight: "400", variable: "--font-archivoblack", display: "swap" });
// Bistro: tall editorial serif with a lovely italic
export const instrumentSerif = Instrument_Serif({ subsets: ["latin"], weight: "400", style: ["normal", "italic"], variable: "--font-instrument", display: "swap" });
// Fresh: warm, friendly serif
export const fraunces = Fraunces({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-fraunces", display: "swap" });
// Vibe: wide, loud sans
export const unbounded = Unbounded({ subsets: ["latin"], weight: ["600", "800"], variable: "--font-unbounded", display: "swap" });

import { Caveat, Zen_Maru_Gothic } from "next/font/google";

/** Fonts for My Product Shelf's own pages (home, sign in, dashboard). Templates have their own. */
export const zen = Zen_Maru_Gothic({ subsets: ["latin"], weight: ["500", "700", "900"], variable: "--font-zen", display: "swap" });
export const caveat = Caveat({ subsets: ["latin"], weight: ["600", "700"], variable: "--font-caveat", display: "swap" });

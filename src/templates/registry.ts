import type { ComponentType } from "react";
import Bento from "./bento/Bento";
import Bistro from "./bistro/Bistro";
import Elegant from "./elegant/Elegant";
import Fresh from "./fresh/Fresh";
import Mosaic from "./mosaic/Mosaic";
import Playful from "./playful/Playful";
import type { TemplateProps } from "./types";
import Vibe from "./vibe/Vibe";

export type TemplateInfo = {
  id: string;
  name: string;
  blurb: { en: string; bn: string };
  swatch: [string, string, string];
  Component: ComponentType<TemplateProps>;
};

/**
 * Add a template: create a component in src/templates/<name>/, then list it here.
 * Everything else (picker, preview, demo, public pages) picks it up automatically.
 */
export const TEMPLATES: TemplateInfo[] = [
  {
    id: "elegant",
    name: "Elegant",
    blurb: { en: "Quiet and classy, with lots of space for your photos.", bn: "শান্ত ও মার্জিত, ছবির জন্য প্রচুর জায়গা।" },
    swatch: ["#f7f5f1", "#1c1b19", "#8a6d3b"],
    Component: Elegant,
  },
  {
    id: "playful",
    name: "Playful",
    blurb: { en: "Bold, colourful and fun. Hard to scroll past.", bn: "উজ্জ্বল, রঙিন ও মজার। চোখ ফেরানো কঠিন।" },
    swatch: ["#ff4a1c", "#2a0f4d", "#ffc83d"],
    Component: Playful,
  },
  {
    id: "mosaic",
    name: "Mosaic",
    blurb: { en: "A masonry wall where every photo keeps its own shape.", bn: "দেয়ালের মতো সাজানো, প্রতিটি ছবি নিজের আকারে।" },
    swatch: ["#f2ece2", "#22302b", "#2f5d50"],
    Component: Mosaic,
  },
  {
    id: "bento",
    name: "Bento",
    blurb: { en: "Grid paper, huge black type and bright colour tiles.", bn: "গ্রিড পেপার, বিশাল কালো লেখা আর উজ্জ্বল রঙের টাইল।" },
    swatch: ["#a855f7", "#ffb400", "#0b6df2"],
    Component: Bento,
  },
  {
    id: "bistro",
    name: "Bistro",
    blurb: { en: "Wine red, a magazine serif and gently tilted cards.", bn: "গাঢ় লাল, ম্যাগাজিন স্টাইলের লেখা আর হালকা বাঁকানো কার্ড।" },
    swatch: ["#69232b", "#ff3b47", "#f3f1ee"],
    Component: Bistro,
  },
  {
    id: "fresh",
    name: "Fresh",
    blurb: { en: "Warm cream and forest green with ticket-stub prices.", bn: "উষ্ণ ক্রিম আর গাঢ় সবুজ, টিকিটের মতো দামের ট্যাগ।" },
    swatch: ["#2a3f27", "#f0ead9", "#fcab10"],
    Component: Fresh,
  },
  {
    id: "vibe",
    name: "Vibe",
    blurb: { en: "Loud and young: wide type and photos cut on a slant.", bn: "প্রাণবন্ত ও তরুণ: চওড়া লেখা আর তির্যকভাবে কাটা ছবি।" },
    swatch: ["#ff4421", "#330a05", "#2f7d5b"],
    Component: Vibe,
  },
];

export const DEFAULT_TEMPLATE = "elegant";
export const getTemplate = (id: string) => TEMPLATES.find((t) => t.id === id) ?? TEMPLATES[0];
export const isTemplate = (id: string) => TEMPLATES.some((t) => t.id === id);

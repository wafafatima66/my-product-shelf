import type { GalleryData, GalleryProduct } from "@/lib/gallery";

/** Sample gallery used on the home page and for empty accounts. Photos: Wikimedia Commons. */
const photo = (file: string) =>
  `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(file)}?width=700`;

const item = (
  id: string, name: string, code: string, price: number, category: string,
  file: string, width: number, height: number,
): GalleryProduct => ({ id, name, code, price, category: "", image: photo(file), thumb: photo(file), width, height });

export const DEMO: GalleryData = {
  shop: {
    slug: "demo",
    name: "Noor Atelier",
    description: "Handmade gold and gemstone jewellery from Dhaka.",
    currency: "BDT",
    instagram: "noor.atelier",
    facebook: "",
    whatsapp: "",
    messenger: "",
  },
  products: [
    item("d1", "Gold Band Ring", "R101", 4800, "Rings", "Gold Ring 2.jpg", 2018, 2478),
    item("d2", "Diamond & Garnet Ring", "R102", 9200, "Rings", "Gold ring with diamonds and garnets 2.jpg", 1904, 1904),
    item("d3", "Starlight White Gold Ring", "R103", 8600, "Rings", "Starlight - white gold ring with diamonds.jpg", 1500, 1500),
    item("d4", "Gold & Kyanite Earrings", "E201", 6200, "Earrings", "Arabesque - gold and kyanite earrings, cropped.jpg", 1229, 2354),
    item("d5", "Domed Ring, Black Diamond", "R104", 7400, "Rings", "Domed gold ring with a black diamond.jpg", 1907, 1432),
    item("d6", "Hoop Earrings with Crown", "E202", 5400, "Earrings", "Hoop earrings with Egyptianizing crown.jpg", 2440, 3320),
    item("d7", "Ruby Statement Ring", "R105", 12500, "Rings", "Poetry - gold ring with large ruby - cropped.jpg", 1666, 1250),
    item("d8", "Amber & Gold Necklace", "N301", 7800, "Necklaces", "Amber & Gold Necklaces, Italic, 500-400 BC (10457281883).jpg", 3168, 4752),
    item("d9", "Ad Astra Diamond Ring", "R106", 10800, "Rings", "Ad Astra - gold ring with diamonds.jpg", 4931, 3698),
  ],
};

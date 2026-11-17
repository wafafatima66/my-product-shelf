import type { Product, Shop } from "@prisma/client";
import { digitsOf, handleOf } from "@/lib/format";
import { mediaUrl } from "@/lib/media";

/** The plain data every template receives. Safe to send to the browser. */
export type GalleryProduct = {
  id: string;
  name: string;
  code: string;
  price: number | null;
  category: string;
  image: string; // full-size url ("" when the product has no photo)
  thumb: string; // small url for grids
  width: number;
  height: number;
};

export type GalleryShop = {
  slug: string;
  name: string;
  description: string;
  currency: string;
  instagram: string; // handle only
  facebook: string; // handle only
  whatsapp: string; // digits only
  messenger: string; // handle only
};

export type GalleryData = { shop: GalleryShop; products: GalleryProduct[] };

export function toGallery(shop: Shop, products: Product[]): GalleryData {
  return {
    shop: {
      slug: shop.slug,
      name: shop.name,
      description: shop.description,
      currency: shop.currency,
      instagram: handleOf(shop.instagram),
      facebook: handleOf(shop.facebook),
      whatsapp: digitsOf(shop.whatsapp),
      messenger: handleOf(shop.messenger),
    },
    products: products.map((p) => ({
      id: p.id,
      name: p.name,
      code: p.code,
      price: p.price,
      category: "", // products no longer have categories; templates only show category tabs when some exist
      image: mediaUrl(p.image),
      thumb: mediaUrl(p.image, true),
      width: p.width,
      height: p.height,
    })),
  };
}

/** Category tabs only exist when at least one product has a category. */
export function categoriesOf(products: GalleryProduct[]) {
  return [...new Set(products.map((p) => p.category.trim()).filter(Boolean))];
}

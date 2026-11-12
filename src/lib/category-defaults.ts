import { normalizeCategorySlug } from "@/components/category/category-hero";

export type CategoryFallback = {
  name: string;
  slug: string;
  image: string;
};

/* Bundled artwork for the storefront's default collections. Keeping one list
   here ensures Home "Our Categories" and CategoryRail never drift or duplicate
   default paths, while newly added admin categories render dynamically from DB. */
export const CATEGORY_FALLBACKS: readonly CategoryFallback[] = [
  { name: "Live Plants", slug: "plants", image: "/images/category-plants.png" },
  { name: "Aquarium Fish", slug: "aquarium-fish", image: "/images/category-aquarium-fish.png" },
  { name: "Exotic Birds", slug: "birds", image: "/images/category-birds.png" },
  { name: "Aquarium Essentials", slug: "aquarium-essentials", image: "/images/category-aquarium-essentials.png" },
  { name: "Pet & Fish Food", slug: "pet-food", image: "/images/category-pet-food.png" },
  { name: "Pots & Planters", slug: "pots", image: "/images/category-pots.png" },
  { name: "Soil & Coco Peat", slug: "soil", image: "/images/category-soil.png" },
];

const FALLBACK_BY_SLUG: Record<string, string> = Object.fromEntries(
  CATEGORY_FALLBACKS.map((item) => [item.slug, item.image]),
);

export const DEFAULT_CATEGORY_SLUGS = new Set(CATEGORY_FALLBACKS.map((item) => item.slug));

export function resolveCategoryImage(slugOrName: string, image?: string | null): string | undefined {
  const trimmed = image?.trim();
  if (trimmed) return trimmed;
  return FALLBACK_BY_SLUG[normalizeCategorySlug(slugOrName)];
}


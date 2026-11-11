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
  { name: "Plants", slug: "plants", image: "/images/category-plants.png" },
  { name: "Pots", slug: "pots", image: "/images/category-pots.png" },
  { name: "Soil", slug: "soil", image: "/images/category-soil.png" },
  { name: "Fertilisers", slug: "fertilisers", image: "/images/category-fertilisers.png" },
  { name: "Seeds", slug: "seeds", image: "/images/category-seeds.png" },
  { name: "Garden Tools", slug: "garden-tools", image: "/images/category-tools.png" },
  { name: "Watering Solutions", slug: "watering-solutions", image: "/images/category-watering.png" },
  { name: "Pest Control", slug: "pest-control", image: "/images/category-pest-control.png" },
  { name: "Gardening Decor", slug: "gardening-decor", image: "/images/category-decor.png" },
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


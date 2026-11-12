const categoryDecorHero = "/images/category-hero-decor.jpg";
const categoryFertilisersHero = "/images/category-hero-fertilisers.jpg";
const categoryPestControlHero = "/images/category-hero-pest-control.jpg";
const categoryPlantsHero = "/images/category-hero-plants.jpg";
const categoryPotsHero = "/images/category-hero-pots.jpg";
const categorySeedsHero = "/images/category-hero-seeds.jpg";
const categorySoilHero = "/images/category-hero-soil.jpg";
const categoryToolsHero = "/images/category-hero-tools.jpg";
const categoryWateringHero = "/images/category-hero-watering.jpg";

type CategoryHeroDetails = {
  image: string;
  title: string;
  description: string;
  align?: "left" | "right";
};

const categoryHeroes: Record<string, CategoryHeroDetails> = {
  plants: {
    image: categoryPlantsHero,
    title: "Bring nature home",
    description: "Healthy indoor & outdoor plants, nursery-acclimatized for Indian homes.",
  },
  "aquarium-fish": {
    image: "/images/hero-aquarium.png",
    title: "Vibrant Aquarium Fish",
    description: "Quarantined Bettas, Koi, Discus, and peaceful schooling varieties.",
    align: "left",
  },
  birds: {
    image: "/images/hero-birds-pets.png",
    title: "Hand-Tamed Exotic Birds",
    description: "Healthy Budgies, Cockatiels, Lovebirds, and vibrant aviary companions.",
    align: "left",
  },
  "aquarium-essentials": {
    image: "/images/hero-aquarium.png",
    title: "Aquascaping & Tank Gear",
    description: "Rimless tanks, silent canisters, full-spectrum lights, and driftwood.",
    align: "left",
  },
  "pet-food": {
    image: "/images/hero-birds-pets.png",
    title: "Clean Pet & Fish Nutrition",
    description: "High-protein pellets, sprays, and natural seeds for fish, birds & pets.",
    align: "left",
  },
  pots: {
    image: categoryPotsHero,
    title: "Artisan Pots & Planters",
    description: "Statement ceramic, terracotta, and self-watering planters built to last.",
  },
  soil: {
    image: categorySoilHero,
    title: "Rich Soil & Coco Peat",
    description: "Washed coco peat, vermicompost, perlite, and balanced potting mixes.",
  },
  fertilisers: {
    image: categoryFertilisersHero,
    title: "Nourishment for every leaf",
    description: "Plant nutrition selected for steady, healthy growth.",
  },
  seeds: {
    image: categorySeedsHero,
    title: "Grow something wonderful",
    description: "Starters and growing essentials for a thriving home space.",
  },
  "garden-tools": {
    image: categoryToolsHero,
    title: "The right tools make it easy",
    description: "Reliable garden essentials made for everyday care.",
  },
  "watering-solutions": {
    image: categoryWateringHero,
    title: "Care in every drop",
    description: "Thoughtful watering tools for thriving plants.",
  },
  "pest-control": {
    image: categoryPestControlHero,
    title: "Gentle care, lasting protection",
    description: "Plant-friendly solutions that help keep your garden healthy.",
  },
  "gardening-decor": {
    image: categoryDecorHero,
    title: "Make your garden feel like home",
    description: "Beautiful details for expressive indoor and outdoor spaces.",
  },
};

const aliases: Record<string, string> = {
  plant: "plants",
  "live-plants": "plants",
  fish: "aquarium-fish",
  "aquarium-fishes": "aquarium-fish",
  bird: "birds",
  "exotic-birds": "birds",
  "aquarium-gear": "aquarium-essentials",
  "aquarium-accessories": "aquarium-essentials",
  "pet-and-fish-food": "pet-food",
  "fish-food": "pet-food",
  "bird-food": "pet-food",
  planters: "pots",
  "pots-planters": "pots",
  "pots-and-planters": "pots",
  "soil-and-coco-peat": "soil",
  "coco-peat": "soil",
  fertiliser: "fertilisers",
  fertilizer: "fertilisers",
  fertilizers: "fertilisers",
  tools: "garden-tools",
  "garden-tools": "garden-tools",
  watering: "watering-solutions",
  "watering-solution": "watering-solutions",
  decor: "gardening-decor",
  "garden-decor": "gardening-decor",
};

export function normalizeCategorySlug(value: string) {
  const normalized = value.trim().toLowerCase().replaceAll("&", "and").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
  return aliases[normalized] ?? normalized;
}

export function getCategoryHero(value: string, fallbackName?: string): CategoryHeroDetails & { hasPreset: boolean } {
  const normalized = normalizeCategorySlug(value);
  const preset = categoryHeroes[normalized];
  if (preset) return { ...preset, hasPreset: true };

  const displayName = fallbackName || value.replaceAll("-", " ");
  return {
    image: categoryPlantsHero,
    title: `Explore ${displayName}`,
    description: "Thoughtfully curated live collection and supplies from Jharna Aquarium & Nursery.",
    hasPreset: false,
  };
}

export function CategoryHero({
  slug,
  name,
  image,
  heroImage,
}: {
  slug: string;
  name: string;
  image?: string | undefined;
  heroImage?: string | undefined;
}) {
  const details = getCategoryHero(slug, name);
  // Keep built-in landscape banners intact unless admin uploads a dedicated hero_image;
  // new custom categories without a preset banner fall back to their category image or default hero.
  const bannerSrc = heroImage?.trim()
    ? heroImage
    : details.hasPreset
      ? details.image
      : image?.trim() || details.image;

  // Our custom `/images/hero-*.png` banners place subjects on the right and open sunlit space on the left,
  // whereas legacy `/images/category-hero-*.jpg` banners keep open space on the right.
  const alignLeft = bannerSrc.includes("/images/hero-") || details.align === "left";

  return (
    <section className="bg-storefront-wash px-3 pb-5 pt-3 sm:px-6 sm:pb-7 lg:px-9 lg:pb-8 lg:pt-4">
      <div className="relative mx-auto h-[240px] max-w-[1480px] overflow-hidden rounded-2xl bg-background sm:h-[270px] lg:aspect-[4.58/1] lg:h-auto">
        <img
          src={bannerSrc}
          alt=""
          width={1600}
          height={560}
          className="absolute inset-x-0 top-0 h-[140px] w-full object-cover object-center sm:inset-0 sm:size-full"
        />
        <div
          className={`absolute inset-x-0 bottom-0 flex h-[100px] items-center bg-storefront-wash px-5 sm:inset-y-0 sm:h-auto sm:w-[48%] sm:bg-transparent sm:px-8 lg:w-[44%] lg:px-12 ${
            alignLeft ? "sm:left-0 sm:right-auto" : "sm:left-auto sm:right-0"
          }`}
        >
          <div className="max-w-[20rem] lg:max-w-[30rem]">
            <h1 className="font-display text-[1.65rem] leading-[1.04] text-primary-dark sm:text-[2.35rem] lg:text-[3.15rem]">
              {details.title}
            </h1>
            {details.description && (
              <p className="mt-2 hidden text-sm leading-5 text-forest/80 sm:block lg:text-[0.95rem]">
                {details.description}
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
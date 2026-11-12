import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { DualTitleAccents } from "@/components/home/section-accents";
import type { Category, SiteMedia } from "@/types/api";

export interface SpaceCard {
  id: string;
  title: string;
  image: string;
  link: string;
}

/* Local defaults across Jharna Aquarium & Nursery's core worlds */
export const defaultSpaceCards: SpaceCard[] = [
  { id: "live-plants", title: "Live Plants", image: "/images/space-plants.png", link: "/plants" },
  { id: "ornamental-fish", title: "Ornamental Fish", image: "/images/space-fish.png", link: "/search?q=fish" },
  { id: "aquarium-gear", title: "Aquarium Essentials", image: "/images/space-aquarium-gear.png", link: "/search?q=aquarium" },
  { id: "exotic-birds", title: "Exotic Birds", image: "/images/space-birds.png", link: "/search?q=bird" },
  { id: "pet-food", title: "Pet & Fish Food", image: "/images/space-pet-food.png", link: "/search?q=food" },
  { id: "pots-soil", title: "Pots, Soil & Coco Peat", image: "/images/space-pots-soil.png", link: "/category/pots" },
];

const SPACE_PARENT_SLUGS = ["shop-by-space", "shop-by-spaces", "spaces", "transform-your-home"];

export function spaceCardsFromCategories(tree: Category[] | undefined): SpaceCard[] {
  const parent = (tree ?? []).find((cat) =>
    SPACE_PARENT_SLUGS.includes((cat.slug || "").toLowerCase()),
  );
  return (parent?.children ?? [])
    .filter((child) => child.slug)
    .map((child) => ({
      id: child.id,
      title: child.name,
      image: child.image || "/images/space-plants.png",
      link: `/category/${child.slug}`,
    }));
}

export function spaceCardsFromMedia(media: SiteMedia[] | undefined): SpaceCard[] {
  const mapped = (media ?? [])
    .filter((item) => item.image)
    .map((item, index) => ({
      id: item.id ?? `space-media-${index}`,
      title: item.title || "Shop now",
      image: item.image as string,
      link: item.cta_url || "/plants",
    }));
  return mapped.length > 0 ? mapped : defaultSpaceCards;
}

function SpaceTile({ space }: { space: SpaceCard }) {
  const external = /^https?:\/\//.test(space.link);
  const inner = (
    <>
      <img
        src={space.image}
        alt={space.title}
        width={800}
        height={800}
        loading="lazy"
        className="absolute inset-0 size-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent"
      />
      <div className="relative z-10 mt-auto flex flex-col items-start gap-2.5 p-4 text-left sm:p-5">
        <h3 className="font-display text-lg font-extrabold leading-tight text-white drop-shadow-sm sm:text-xl lg:text-2xl">
          {space.title}
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-forest shadow-md transition-colors duration-200 group-hover:bg-[#eaff00] sm:px-5 sm:text-sm">
          <span>Shop Now</span>
          <ArrowRight className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5" strokeWidth={2.3} />
        </span>
      </div>
    </>
  );

  const className =
    "group relative flex aspect-square flex-col overflow-hidden rounded-2xl border border-black/10 bg-primary-soft shadow-[0_2px_14px_rgba(0,0,0,0.08)]";

  return external ? (
    <a href={space.link} target="_blank" rel="noreferrer" className={className}>
      {inner}
    </a>
  ) : (
    <Link to={space.link} className={className}>
      {inner}
    </Link>
  );
}

export function ShopBySpaceSection({
  spaces = defaultSpaceCards,
  title = "Transform Your Home.",
}: {
  spaces?: SpaceCard[];
  title?: string;
}) {
  if (spaces.length === 0) return null;

  return (
    <section className="bg-[#fbe4ed] py-10 lg:py-14">
      <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
        <div className="mb-7 flex flex-wrap items-center justify-center gap-3 text-center lg:mb-9">
          <DualTitleAccents />
          <h2 className="font-display text-[1.85rem] font-extrabold text-foreground sm:text-[2.5rem] lg:text-[3rem]">
            {title}
          </h2>
        </div>
        <div
          className={`grid grid-cols-2 gap-4 sm:gap-5 lg:gap-6 ${
            spaces.length === 4 ? "lg:grid-cols-4" : "md:grid-cols-3"
          }`}
        >
          {spaces.map((space) => (
            <SpaceTile key={space.id} space={space} />
          ))}
        </div>
      </div>
    </section>
  );
}

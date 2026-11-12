/* The green band of round category tiles under the hero. Tiles come from the
   admin's category tree, and the bundled artwork below fills the row out to
   nine while the catalogue still has departments the admin has not created —
   a single live category must not leave the band with one tile in it. */

import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { DualTitleAccents } from "@/components/home/section-accents";
import { CATEGORY_FALLBACKS, resolveCategoryImage } from "@/lib/category-defaults";
import { navCategories } from "@/lib/nav-categories";
import type { Category } from "@/types/api";

const TILE = "group w-[96px] shrink-0 text-center sm:w-[110px] lg:w-[116px]";
const TILE_IMG =
  "mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-full bg-white p-3 shadow-sm transition-transform duration-300 group-hover:-translate-y-2 sm:p-4";
const TILE_LABEL = "mt-4 line-clamp-2 text-sm font-medium leading-5 text-white sm:text-[15px]";

export function CategoryStrip({
  categories,
  title = "Our Categories",
  limit = 9,
}: {
  categories: Category[] | undefined;
  title?: string;
  limit?: number;
}) {
  // Show every live shop category added from admin without dropping categories
  // added beyond the default row size; pad with bundled artwork only below `limit`.
  const live = navCategories(categories);
  const liveSlugs = new Set(live.map((cat) => (cat.slug || "").toLowerCase()));
  const filler = CATEGORY_FALLBACKS
    .filter((shortcut) => !liveSlugs.has(shortcut.slug))
    .slice(0, Math.max(0, limit - live.length));
  const totalTiles = live.length + filler.length;

  return (
    <section className="mt-6 min-w-0 overflow-hidden bg-forest px-3 py-5 sm:px-6 sm:py-7 lg:mt-8 lg:px-9 lg:py-8">
      {title && (
        <div className="mb-6 flex flex-wrap items-center justify-center gap-3 text-center sm:mb-8">
          <DualTitleAccents variant="dark" />
          <h2 className="font-display text-[2rem] font-bold text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            {title}
          </h2>
        </div>
      )}
      <div className="mx-auto w-full min-w-0 max-w-full overflow-x-auto overscroll-x-contain pb-4 [scrollbar-width:none] lg:max-w-[1480px] [&::-webkit-scrollbar]:hidden">
        <div
          className={`flex w-max min-w-full justify-start gap-4 px-2 sm:gap-6 lg:gap-6 ${
            totalTiles <= 9 ? "lg:justify-center" : "lg:justify-start"
          }`}
        >
          {live.map((cat) => {
            const imgSrc = resolveCategoryImage(cat.slug || cat.name, cat.image);
            const scale = typeof cat.image_scale === "number" && cat.image_scale > 0 && cat.image_scale !== 1 ? cat.image_scale : null;
            return (
              <Link key={cat.id} to="/category/$slug" params={{ slug: cat.slug || cat.id }} className={TILE}>
                <div className={TILE_IMG}>
                  {imgSrc ? (
                    <img
                      src={imgSrc}
                      alt={cat.name}
                      loading="lazy"
                      className="size-full object-contain"
                      style={scale ? { transform: `scale(${scale})` } : undefined}
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center rounded-full bg-primary-tint">
                      <Leaf className="size-8 text-primary" />
                    </span>
                  )}
                </div>
                <h3 className={TILE_LABEL}>{cat.name}</h3>
              </Link>
            );
          })}

          {filler.map(({ name, slug, image }) => (
            <Link key={name} to="/category/$slug" params={{ slug }} className={TILE}>
              <div className={TILE_IMG}>
                <img src={image} alt="" width={816} height={816} loading="lazy" className="size-full object-contain" />
              </div>
              <h3 className={`${TILE_LABEL} lg:min-h-10`}>{name}</h3>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

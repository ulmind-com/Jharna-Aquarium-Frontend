import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { Leaf } from "lucide-react";
import { categoriesApi, queryKeys } from "@/api/services";
import { CATEGORY_FALLBACKS, resolveCategoryImage } from "@/lib/category-defaults";
import { navCategories } from "@/lib/nav-categories";
import type { Category } from "@/types/api";
import { normalizeCategorySlug } from "./category-hero";

export function CategoryRail({
  activeSlug,
  categories: providedCategories,
}: {
  activeSlug: string;
  categories?: Category[] | undefined;
}) {
  const { data: queriedCategories } = useQuery({
    queryKey: queryKeys.categories,
    queryFn: categoriesApi.list,
    staleTime: 30_000,
    enabled: providedCategories === undefined,
  });

  const allCategories = providedCategories ?? queriedCategories;
  const selected = normalizeCategorySlug(activeSlug);
  const activeEntry = (allCategories ?? []).find(
    (item) => normalizeCategorySlug(item.slug || item.name) === selected || item.id === activeSlug,
  );
  const activeParentId = activeEntry?.parent_id ?? null;
  const live = navCategories(allCategories);

  const tiles =
    live.length > 0
      ? live.map((cat) => ({
          key: cat.id,
          id: cat.id,
          name: cat.name,
          slug: cat.slug || cat.id,
          image: resolveCategoryImage(cat.slug || cat.name, cat.image),
          imageScale: cat.image_scale ?? null,
        }))
      : CATEGORY_FALLBACKS.map((item) => ({
          key: item.slug,
          id: undefined as string | undefined,
          name: item.name,
          slug: item.slug,
          image: item.image as string | undefined,
          imageScale: null as number | null,
        }));

  return (
    <section className="min-w-0 overflow-hidden bg-storefront-wash px-3 pb-8 sm:px-6 sm:pb-9 lg:px-9 lg:pb-10">
      <div className="mx-auto w-full min-w-0 max-w-[1480px] overflow-x-auto overscroll-x-contain pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        <div
          className={`flex min-w-max gap-3 sm:gap-5 lg:gap-4 ${
            tiles.length <= 9 ? "lg:w-full lg:justify-between" : "lg:justify-start"
          }`}
        >
          {tiles.map(({ key, id, name, slug, image, imageScale }) => {
            const active =
              normalizeCategorySlug(slug) === selected ||
              (id !== undefined && (id === activeSlug || id === activeParentId));
            const scale =
              typeof imageScale === "number" && imageScale > 0 && imageScale !== 1
                ? imageScale
                : null;
            return (
              <Link
                key={key}
                to="/category/$slug"
                params={{ slug }}
                aria-current={active ? "page" : undefined}
                className="group w-[88px] shrink-0 text-center sm:w-[108px] lg:w-[118px]"
              >
                <div
                  className={`mx-auto flex aspect-square items-center justify-center overflow-hidden rounded-full bg-background p-2 transition-colors duration-200 sm:p-2.5 ${
                    active ? "ring-1 ring-primary" : "group-hover:ring-1 group-hover:ring-primary"
                  }`}
                >
                  {image ? (
                    <img
                      src={image}
                      alt=""
                      width={512}
                      height={512}
                      loading="lazy"
                      className="size-full object-contain transition-transform duration-300 group-hover:scale-105"
                      style={scale ? { transform: `scale(${scale})` } : undefined}
                    />
                  ) : (
                    <span className="flex size-full items-center justify-center rounded-full bg-primary-tint">
                      <Leaf className="size-7 text-primary" />
                    </span>
                  )}
                </div>
                <h2 className="mt-2.5 line-clamp-2 text-xs font-medium leading-4 sm:text-sm lg:min-h-10">
                  {name}
                </h2>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
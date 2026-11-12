import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export interface SpotlightPromo {
  id: string;
  image: string;
  badge?: string;
  title?: string;
  description?: string;
  ctaLabel?: string;
  link: string;
  alt: string;
}

/* Bundled artwork — used until the admin panel supplies spotlight promos */
export const defaultSpotlightPromos: SpotlightPromo[] = [
  {
    id: "sp1",
    image: "/images/spotlight-1.png",
    badge: "Bestseller Spotlight",
    title: "Starring Peace Lily",
    description: "Air-purifying white blooms in a warm artisan ceramic planter.",
    ctaLabel: "Shop Peace Lily",
    link: "/search?q=Peace%20Lily",
    alt: "Starring Peace Lily in ceramic planter",
  },
  {
    id: "sp2",
    image: "/images/spotlight-2.png",
    badge: "New Arrival",
    title: "Fresh Kadi Patta",
    description: "Aromatic kitchen-garden curry leaf plant thriving on sunny ledges.",
    ctaLabel: "Explore Herbs",
    link: "/search?q=Kadi%20Patta",
    alt: "Fresh Kadi Patta Plant New Launch",
  },
];

export function SpotlightSection({
  promos,
  title = "In the Spotlight",
  subtitle = "One for the Tadka, One for the Drama",
}: {
  promos: SpotlightPromo[];
  title?: string;
  subtitle?: string;
}) {
  if (!promos || promos.length === 0) return null;

  return (
    <section className="bg-storefront-wash py-7 sm:py-9">
      {/* Header */}
      <div className="mx-auto mb-5 flex max-w-[1480px] flex-col items-center px-3 text-center sm:mb-6 sm:px-6 lg:px-9">
        <div className="relative z-0 inline-block">
          <div className="absolute bottom-1 left-[-10px] right-[-10px] top-1.5 -z-10 bg-[#eaff00]" />
          <h2 className="font-display text-2xl font-extrabold text-black sm:text-3xl lg:text-4xl">
            {title}
          </h2>
        </div>
        {subtitle && (
          <p className="mt-2.5 text-sm font-medium text-black/85 sm:text-base">{subtitle}</p>
        )}
      </div>

      {/* Compact Editorial Promo Cards */}
      <div
        className={`mx-auto grid max-w-[1480px] grid-cols-1 gap-4 px-3 sm:px-6 lg:gap-6 lg:px-9 ${
          promos.length === 1 ? "max-w-3xl" : "md:grid-cols-2"
        }`}
      >
        {promos.map((promo) => {
          const headline = promo.title || promo.alt;
          const ctaText = promo.ctaLabel || "Shop now";

          return (
            <Link
              key={promo.id}
              to={promo.link}
              className="group relative flex h-[215px] w-full items-stretch overflow-hidden rounded-2xl border border-black/10 bg-[#17231c] shadow-sm transition-shadow duration-300 hover:shadow-md sm:h-[235px] lg:h-[265px]"
            >
              <img
                src={promo.image}
                alt={promo.alt || headline || "Spotlight highlight"}
                loading="lazy"
                className="absolute inset-0 size-full object-cover object-right transition-transform duration-700 ease-out group-hover:scale-[1.03]"
              />
              <div
                className="pointer-events-none absolute inset-0"
                style={{
                  background:
                    "linear-gradient(90deg, rgba(16, 26, 20, 0.96) 0%, rgba(16, 26, 20, 0.86) 46%, rgba(16, 26, 20, 0.44) 68%, rgba(16, 26, 20, 0.04) 100%)",
                }}
              />

              <div className="relative z-10 flex h-full max-w-[60%] flex-col justify-between p-4 sm:max-w-[56%] sm:p-6">
                <div>
                  {promo.badge && (
                    <span className="inline-flex w-fit items-center rounded-full bg-[#eaff00] px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider text-black">
                      {promo.badge}
                    </span>
                  )}
                  {headline && (
                    <h3 className="mt-2 line-clamp-2 font-display text-xl font-extrabold leading-tight tracking-tight text-white sm:text-2xl">
                      {headline}
                    </h3>
                  )}
                  {promo.description && (
                    <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-white/85 sm:text-sm">
                      {promo.description}
                    </p>
                  )}
                </div>

                <span className="mt-3 inline-flex w-fit shrink-0 items-center gap-1.5 rounded-full bg-white px-4 py-1.5 text-xs font-bold text-[#142219] shadow-sm transition-colors duration-200 group-hover:bg-[#eaff00] sm:px-5 sm:py-2 sm:text-sm">
                  <span>{ctaText}</span>
                  <ArrowRight
                    className="size-3.5 transition-transform duration-200 group-hover:translate-x-0.5 sm:size-4"
                    strokeWidth={2.4}
                  />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}

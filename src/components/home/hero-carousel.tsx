import { Link } from "@tanstack/react-router";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import type { Banner } from "@/types/api";

const fallbackBanners: Banner[] = [
  {
    id: "hero-aquarium",
    image: "/images/hero-aquarium.png",
    badge: "Aquarium & Exotic Fish",
    title: "Vivid Aquariums & Exotic Fish",
    subtitle: "Healthy freshwater fish, planted tanks, filters, heaters & aquascape decor.",
    cta_label: "Explore Aquarium",
    cta_url: "/search?q=aquarium",
  },
  {
    id: "hero-plants",
    image: "/images/hero-plants.png",
    badge: "Live Botanical Nursery",
    title: "Lush Plants for Every Corner",
    subtitle: "Hand-nurtured indoor foliage, flowering perennials, palms & air-purifying greens.",
    cta_label: "Shop Live Plants",
    cta_url: "/plants",
  },
  {
    id: "hero-birds-pets",
    image: "/images/hero-birds-pets.png",
    badge: "Birds & Pet Nutrition",
    title: "Happy Birds & Wholesome Pet Food",
    subtitle: "Healthy companion birds, nutritious seed blends, fish pellets & daily care treats.",
    cta_label: "Shop Pet & Bird Care",
    cta_url: "/search?q=bird",
  },
  {
    id: "hero-supplies",
    image: "/images/hero-garden-supplies.png",
    badge: "Pots, Mati & Coco Peat",
    title: "Everything Your Garden Needs",
    subtitle: "Designer pots, enriched garden soil (mati), organic coco peat & nursery tools.",
    cta_label: "Shop Garden Supplies",
    cta_url: "/category/pots",
  },
];

export function HeroCarousel({ banners, shopName }: { banners: Banner[]; shopName: string }) {
  let slides = banners.filter((b) => b.active !== false && (b.image || b.video));
  if (slides.length === 0) {
    slides = fallbackBanners;
  }

  const [index, setIndex] = useState(0);
  const safeIndex = index % slides.length;

  useEffect(() => {
    if (slides.length < 2) return;
    const id = setInterval(() => setIndex((i) => (i + 1) % slides.length), 5000);
    return () => clearInterval(id);
  }, [slides.length]);

  const prev = () => setIndex((i) => (i - 1 + slides.length) % slides.length);
  const next = () => setIndex((i) => (i + 1) % slides.length);

  return (
    <section className="bg-storefront-wash px-3 pt-3 sm:px-6 lg:px-9 lg:pt-3">
      <div className="group/hero relative mx-auto h-[265px] w-full max-w-[1480px] overflow-hidden rounded-2xl bg-[#132119] shadow-sm sm:h-[310px] lg:h-[360px] xl:h-[385px]">
        <div
          className="flex h-full w-full transition-transform duration-700 ease-out"
          style={{ transform: `translateX(-${safeIndex * 100}%)` }}
        >
          {slides.map((slide, i) => {
            const targetUrl = slide.cta_url || "/plants";
            const ctaText = slide.cta_label || "Shop Now";
            const external = /^https?:\/\//.test(targetUrl);

            const buttonClass =
              "mt-4 inline-flex w-fit items-center gap-2 rounded-full bg-white px-5 py-2 font-display text-xs font-bold text-[#132219] shadow-md transition-all duration-200 hover:bg-[#eaff00] sm:mt-6 sm:px-7 sm:py-2.5 sm:text-sm";

            return (
              <div key={slide.id || i} className="relative h-full w-full shrink-0">
                {slide.video ? (
                  <video
                    src={slide.video}
                    poster={slide.poster}
                    autoPlay
                    muted
                    loop
                    playsInline
                    className="absolute inset-0 size-full object-cover object-right"
                  />
                ) : (
                  <img
                    src={slide.image}
                    alt={slide.title || shopName}
                    className="absolute inset-0 size-full object-cover object-right"
                  />
                )}

                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0"
                  style={{
                    background:
                      "linear-gradient(90deg, rgba(13, 27, 20, 0.94) 0%, rgba(13, 27, 20, 0.78) 42%, rgba(13, 27, 20, 0.28) 68%, rgba(13, 27, 20, 0.04) 100%)",
                  }}
                />

                <div className="relative z-10 flex h-full items-center px-5 sm:px-10 lg:px-14">
                  <div className="flex max-w-[78%] flex-col items-start text-left sm:max-w-[54%] lg:max-w-[46%]">
                    {slide.badge && (
                      <span className="inline-flex w-fit items-center rounded-full bg-[#eaff00] px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-black sm:px-3 sm:py-1 sm:text-[11px]">
                        {slide.badge}
                      </span>
                    )}
                    <h1 className="mt-2 font-display text-xl font-extrabold leading-[1.1] tracking-tight text-white drop-shadow-sm sm:mt-3 sm:text-3xl lg:text-[2.65rem]">
                      {slide.title || "Bring life to your space"}
                    </h1>
                    {slide.subtitle && (
                      <p className="mt-2 line-clamp-3 max-w-[42ch] text-xs leading-relaxed text-white/85 sm:mt-3 sm:line-clamp-none sm:text-sm lg:text-base">
                        {slide.subtitle}
                      </p>
                    )}
                    {external ? (
                      <a href={targetUrl} target="_blank" rel="noreferrer" className={buttonClass}>
                        <span>{ctaText}</span>
                        <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2.4} />
                      </a>
                    ) : (
                      <Link to={targetUrl} className={buttonClass}>
                        <span>{ctaText}</span>
                        <ArrowRight className="size-3.5 sm:size-4" strokeWidth={2.4} />
                      </Link>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {slides.length > 1 && (
          <>
            <button
              type="button"
              onClick={prev}
              aria-label="Previous banner"
              className="absolute left-3 top-1/2 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/55 group-hover/hero:opacity-100 sm:flex"
            >
              <ChevronLeft className="size-5" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next banner"
              className="absolute right-3 top-1/2 z-20 hidden size-9 -translate-y-1/2 items-center justify-center rounded-full bg-black/35 text-white opacity-0 backdrop-blur-sm transition hover:bg-black/55 group-hover/hero:opacity-100 sm:flex"
            >
              <ChevronRight className="size-5" />
            </button>

            <div className="absolute bottom-3 left-1/2 z-20 flex -translate-x-1/2 gap-2">
              {slides.map((slide, i) => (
                <button
                  key={slide.id || i}
                  type="button"
                  aria-label={`Show slide ${i + 1}`}
                  aria-current={i === safeIndex}
                  onClick={() => setIndex(i)}
                  className={`h-1.5 rounded-full transition-all duration-200 ${
                    i === safeIndex ? "w-7 bg-[#eaff00]" : "w-3 bg-white/45 hover:bg-white/75"
                  }`}
                />
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}

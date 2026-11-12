/* Closing showcase section above the footer highlighting Jharna Aquarium & Nursery's
   complete in-store & online offering across live plants, ornamental fish, exotic birds,
   pet nutrition, aquarium setups, pots, soil and coco peat — tailored for a single store. */

import { Link } from "@tanstack/react-router";
import { ArrowRight, CheckCircle2, MapPin, ShieldCheck, Sparkles } from "lucide-react";
import { DualTitleAccents } from "@/components/home/section-accents";

const HIGHLIGHTS = [
  "Live Plants (Gach) & Flowering Varieties",
  "Healthy Aquarium Fish (Mach) & Tanks",
  "Companion Birds (Pakhi) & Bird Feeds",
  "Designer Pots, Enriched Mati & Coco Peat",
];

export function NatureAcrossIndiaSection({
  title = "Everything Alive & Thriving Under One Roof",
  subtitle = "Visit Jharna Aquarium & Nursery or order locally for healthy plants, vibrant fish, tame birds, wholesome pet food, and curated soil & pot supplies.",
  image = "/images/sanctuary-showcase.png",
}: {
  title?: string;
  subtitle?: string;
  statValue?: string;
  statLabel?: string;
  image?: string;
}) {
  return (
    <section className="-mb-10 bg-white pt-10 pb-14 lg:pt-14 lg:pb-16">
      <div className="mx-auto grid max-w-[1480px] items-center gap-8 px-4 sm:px-6 lg:grid-cols-12 lg:gap-12 lg:px-10">
        <div className="lg:col-span-6">
          <div className="mb-4 flex items-center gap-3">
            <DualTitleAccents />
            <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-tint px-3 py-1 text-xs font-bold uppercase tracking-wider text-forest">
              <Sparkles className="size-3.5 text-primary" aria-hidden="true" />
              Jharna Aquarium &amp; Nursery
            </span>
          </div>

          <h2 className="font-display text-2xl font-extrabold leading-tight tracking-tight text-forest sm:text-4xl lg:text-[2.6rem]">
            {title}
          </h2>
          <p className="mt-3 max-w-[54ch] text-sm leading-relaxed text-muted-foreground sm:text-base">
            {subtitle}
          </p>

          <ul className="mt-5 grid grid-cols-1 gap-2.5 sm:grid-cols-2">
            {HIGHLIGHTS.map((item) => (
              <li
                key={item}
                className="flex items-center gap-2 rounded-xl border border-border/70 bg-storefront-wash px-3.5 py-2.5 text-xs font-semibold text-forest sm:text-sm"
              >
                <CheckCircle2 className="size-4 shrink-0 text-primary" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <Link
              to="/plants"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3 font-display text-sm font-bold text-primary-foreground shadow-sm transition hover:bg-primary/90"
            >
              <span>Browse Catalogue</span>
              <ArrowRight className="size-4" strokeWidth={2.2} />
            </Link>
            <Link
              to="/locate-store"
              className="inline-flex items-center gap-2 rounded-full border border-forest/20 bg-white px-5 py-3 font-display text-sm font-bold text-forest transition hover:border-primary hover:bg-primary-tint/50"
            >
              <MapPin className="size-4 text-primary" strokeWidth={2.1} />
              <span>Visit Our Store</span>
            </Link>
          </div>
        </div>

        <div className="lg:col-span-6">
          <div className="relative overflow-hidden rounded-3xl border border-forest/10 bg-storefront-wash shadow-sm">
            <img
              src={image}
              alt="Jharna Aquarium & Nursery flagship botanical and aquatic showroom"
              width={1376}
              height={768}
              loading="lazy"
              className="h-[230px] w-full object-cover sm:h-[300px] lg:h-[340px]"
            />
            <div className="grid grid-cols-3 divide-x divide-forest/10 border-t border-forest/10 bg-white px-2 py-4 text-center sm:px-4">
              <div className="px-2">
                <p className="font-display text-base font-extrabold text-primary sm:text-xl">6+ Worlds</p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">Plants, Fish, Birds &amp; Gear</p>
              </div>
              <div className="px-2">
                <p className="font-display text-base font-extrabold text-primary sm:text-xl">100% Healthy</p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">Hand-Checked Stock</p>
              </div>
              <div className="px-2">
                <p className="flex items-center justify-center gap-1 font-display text-base font-extrabold text-primary sm:text-xl">
                  <ShieldCheck className="size-4 shrink-0 sm:size-5" aria-hidden="true" />
                  <span>Care Support</span>
                </p>
                <p className="mt-0.5 text-[11px] font-medium text-muted-foreground sm:text-xs">Expert Local Guidance</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

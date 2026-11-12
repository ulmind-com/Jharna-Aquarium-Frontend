import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { MapPin } from "lucide-react";
import { queryKeys, storesApi } from "@/api/services";
import { StoreLocatorSection, storesFromApi } from "@/components/home/store-locator";

export const Route = createFileRoute("/locate-store")({
  head: () => ({
    meta: [
      { title: "Visit Our Store | Jharna Aquarium & Nursery" },
      { name: "description", content: "Visit Jharna Aquarium & Nursery — healthy plants, exotic aquarium fish, birds, pet nutrition and gardening essentials." },
      { property: "og:title", content: "Visit Our Store | Jharna Aquarium & Nursery" },
      { property: "og:description", content: "Visit Jharna Aquarium & Nursery for in-person advice on plants, aquariums and pet care." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: Page,
});

function Page() {
  const { data } = useQuery({ queryKey: queryKeys.stores, queryFn: storesApi.list, staleTime: 300_000 });
  const stores = storesFromApi(data);

  return (
    <div className="bg-storefront-wash">
      <section className="bg-forest py-14 text-center lg:py-20">
        <div className="mx-auto max-w-[1480px] px-4 sm:px-6 lg:px-10">
          <span className="inline-flex items-center gap-2 rounded-full bg-star px-4 py-1.5 font-display text-xs font-bold text-forest sm:text-sm">
            <MapPin className="size-3.5" aria-hidden="true" />
            Walk in, explore &amp; take nature home
          </span>
          <h1 className="mt-5 font-display text-[2rem] font-extrabold tracking-tight text-white sm:text-[2.75rem] lg:text-[3.25rem]">
            Visit Jharna Aquarium &amp; Nursery
          </h1>
          <p className="mx-auto mt-4 max-w-[46rem] text-sm leading-7 text-white/85 sm:text-base sm:leading-8">
            Step into our store for healthy indoor and outdoor plants, colorful ornamental fish, aquascaping tanks, birds, wholesome pet food, pots, soil and coco peat — with direct personal guidance.
          </p>
        </div>
      </section>

      <StoreLocatorSection
        stores={stores.slice(0, 1)}
        title="Visit Our Flagship Store"
        subtitle="Open for walk-ins, live stock selection, tank setups and plant care advice."
      />
    </div>
  );
}

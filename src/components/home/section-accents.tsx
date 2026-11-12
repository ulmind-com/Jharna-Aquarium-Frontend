/** Transparent tree & aquarium accents echoing Jharna Aquarium & Nursery's
 *  dual botanical + aquatic identity with zero background frame. */

export function DualTitleAccents(_props?: { variant?: "light" | "dark" }) {
  return (
    <span className="inline-flex items-center gap-2 align-middle" aria-hidden="true">
      <img
        src="/images/accent-tree.png"
        alt=""
        width={48}
        height={48}
        loading="lazy"
        className="size-9 object-contain sm:size-11"
      />
      <img
        src="/images/accent-aquarium.png"
        alt=""
        width={48}
        height={48}
        loading="lazy"
        className="size-9 object-contain sm:size-11"
      />
    </span>
  );
}


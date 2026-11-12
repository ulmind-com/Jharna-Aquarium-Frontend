/** Small tactile tree & aquarium visual medallions echoing the shop's
 *  dual identity ("Jharna Aquarium & Nursery") beside section headings. */

export function DualTitleAccents({
  variant = "light",
}: {
  variant?: "light" | "dark";
}) {
  const frame =
    variant === "dark"
      ? "border-white/20 bg-white/10 shadow-sm"
      : "border-forest/15 bg-white shadow-sm";

  return (
    <span className="inline-flex items-center gap-1.5 align-middle" aria-hidden="true">
      <img
        src="/images/accent-tree.png"
        alt=""
        width={48}
        height={48}
        loading="lazy"
        className={`size-9 rounded-full border object-cover sm:size-11 ${frame}`}
      />
      <img
        src="/images/accent-aquarium.png"
        alt=""
        width={48}
        height={48}
        loading="lazy"
        className={`size-9 rounded-full border object-cover sm:size-11 ${frame}`}
      />
    </span>
  );
}


import { Link } from "@tanstack/react-router";

/* Split a shop name into dark + accent halves so the navbar wordmark carries
   the brand palette smoothly across both multi-word and CamelCase names. */
function splitName(name: string): [string, string] {
  const clean = name.replace(/\s+/g, " ").trim();
  const ampIdx = clean.indexOf("&");
  if (ampIdx > 0) {
    return [clean.slice(0, ampIdx), clean.slice(ampIdx)];
  }
  const lastSpace = clean.lastIndexOf(" ");
  if (lastSpace > 0) {
    return [clean.slice(0, lastSpace + 1), clean.slice(lastSpace + 1)];
  }
  const match = /^([A-Z][a-z]*)([A-Z].*)$/.exec(clean);
  return match ? [match[1]!, match[2]!] : [clean, ""];
}

export function BrandMark({ className = "size-9" }: { className?: string }) {
  return (
    <span className={`relative inline-flex shrink-0 items-center justify-center overflow-hidden ${className}`}>
      <img
        src="/assets/jharna-logo.png"
        alt="Jharna Aquarium & Nursery"
        className="size-full object-contain"
        loading="eager"
        decoding="async"
      />
    </span>
  );
}

export function BrandLogo({
  name,
  size = "md",
  tone = "dark",
  asLink = true,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  tone?: "dark" | "light";
  asLink?: boolean;
}) {
  const [head, tail] = splitName(name);

  const mark = { sm: "size-7", md: "size-7 sm:size-9 lg:size-10", lg: "size-11" }[size];
  const text = {
    sm: "text-base sm:text-lg",
    md: "text-[12.5px] sm:text-lg lg:text-[1.3rem] xl:text-[1.45rem]",
    lg: "text-xl sm:text-[1.65rem]",
  }[size];

  const inner = (
    <>
      <BrandMark className={mark} />
      <span className={`truncate font-display font-extrabold leading-none tracking-[-0.02em] lg:overflow-visible lg:whitespace-nowrap ${text}`}>
        <span className={tone === "light" ? "text-white" : "text-forest"}>{head}</span>
        {tail && <span className={tone === "light" ? "text-primary-soft" : "text-primary"}>{tail}</span>}
      </span>
    </>
  );

  const className = "flex min-w-0 items-center gap-1.5 transition-opacity hover:opacity-90 sm:gap-2.5";
  return asLink ? (
    <Link to="/" aria-label={`${name} — home`} className={className}>{inner}</Link>
  ) : (
    <span className={className}>{inner}</span>
  );
}

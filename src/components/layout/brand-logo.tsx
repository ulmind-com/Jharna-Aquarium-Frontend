import { Link } from "@tanstack/react-router";

/* "Jharna Aquarium & Nursery" reads as two words, so the wordmark splits on the inner capital
   and colours the halves differently. Any other shop name renders in one tone. */
function splitName(name: string): [string, string] {
  const match = /^([A-Z][a-z]*)([A-Z].*)$/.exec(name.replace(/\s+/g, " ").trim());
  return match ? [match[1]!, match[2]!] : [name, ""];
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

  const mark = { sm: "size-8", md: "size-9 lg:size-10", lg: "size-11" }[size];
  const text = {
    sm: "text-lg",
    md: "text-xl sm:text-[1.45rem] lg:text-[1.6rem]",
    lg: "text-2xl sm:text-[1.75rem]",
  }[size];

  const inner = (
    <>
      <BrandMark className={mark} />
      <span className={`whitespace-nowrap font-display font-extrabold leading-none tracking-[-0.02em] ${text}`}>
        <span className={tone === "light" ? "text-white" : "text-forest"}>{head}</span>
        {tail && <span className={tone === "light" ? "text-primary-soft" : "text-primary"}>{tail}</span>}
      </span>
    </>
  );

  const className = "flex min-w-0 items-center gap-2.5 transition-opacity hover:opacity-90";
  return asLink ? (
    <Link to="/" aria-label={`${name} — home`} className={className}>{inner}</Link>
  ) : (
    <span className={className}>{inner}</span>
  );
}
